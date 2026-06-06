import Quotation from '../models/Quotation.js';
import RFQ from '../models/RFQ.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { logActivity } from '../utils/activityLogger.js';

export const getQuotations = async (req, res) => {
  const { status, rfq, page = 1, limit = 10 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (rfq) query.rfq = rfq;

  // Vendors can only see their own quotations
  if (req.user.role === 'vendor') {
    query.vendor = req.user._id;
  }

  const quotations = await Quotation.find(query)
    .populate('rfq', 'rfqNumber title')
    .populate('vendor', 'name email category rating')
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Quotation.countDocuments(query);

  sendSuccess(res, { quotations, total, page: parseInt(page), pages: Math.ceil(total / limit) }, 'Quotations fetched');
};

export const submitQuotation = async (req, res) => {
  const { rfq, items, deliveryDays, notes } = req.body;

  const targetRfq = await RFQ.findById(rfq);
  if (!targetRfq) return sendError(res, 'RFQ not found', 404);

  if (targetRfq.status !== 'open') {
    return sendError(res, 'RFQ is not open for quotations', 400);
  }

  if (targetRfq.deadline < new Date()) {
    return sendError(res, 'RFQ deadline has passed', 400);
  }

  const existingQuotation = await Quotation.findOne({ rfq, vendor: req.user._id });
  if (existingQuotation) {
    return sendError(res, 'You have already submitted a quotation for this RFQ', 400);
  }

  const quotation = await Quotation.create({
    rfq,
    vendor: req.user._id,
    items,
    deliveryDays,
    notes,
    status: 'submitted',
    submittedAt: new Date()
  });

  await logActivity({
    action: 'SUBMIT_QUOTATION',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'Quotation',
    targetId: quotation._id,
    targetLabel: targetRfq.rfqNumber,
    req
  });

  sendSuccess(res, quotation, 'Quotation submitted successfully', 201);
};

export const getQuotationById = async (req, res) => {
  const quotation = await Quotation.findById(req.params.id)
    .populate('rfq')
    .populate('vendor', 'name email phone address rating');

  if (!quotation) return sendError(res, 'Quotation not found', 404);

  // Check access
  if (req.user.role === 'vendor' && quotation.vendor._id.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized to view this quotation', 403);
  }

  sendSuccess(res, quotation, 'Quotation fetched');
};

export const withdrawQuotation = async (req, res) => {
  const quotation = await Quotation.findById(req.params.id).populate('rfq');
  
  if (!quotation) return sendError(res, 'Quotation not found', 404);

  if (quotation.vendor.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized', 403);
  }

  if (quotation.status !== 'submitted') {
    return sendError(res, 'Cannot withdraw quotation at this stage', 400);
  }

  quotation.status = 'withdrawn';
  await quotation.save();

  await logActivity({
    action: 'WITHDRAW_QUOTATION',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'Quotation',
    targetId: quotation._id,
    targetLabel: quotation.rfq.rfqNumber,
    req
  });

  sendSuccess(res, quotation, 'Quotation withdrawn successfully');
};
