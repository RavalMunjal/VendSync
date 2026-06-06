import RFQ from '../models/RFQ.js';
import Vendor from '../models/Vendor.js';
import Quotation from '../models/Quotation.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { generateRFQNumber } from '../utils/generateNumber.js';
import { logActivity } from '../utils/activityLogger.js';
import { sendRFQNotification } from '../utils/emailService.js';

export const getRFQs = async (req, res) => {
  const { status, priority, page = 1, limit = 10 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;

  // Vendors can only see RFQs assigned to them and not in draft status
  if (req.user.role === 'vendor') {
    query.assignedVendors = req.user._id;
    query.status = { $ne: 'draft' };
  }

  const rfqs = await RFQ.find(query)
    .populate('createdBy', 'name email')
    .populate('assignedVendors', 'name category')
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await RFQ.countDocuments(query);

  sendSuccess(res, { rfqs, total, page: parseInt(page), pages: Math.ceil(total / limit) }, 'RFQs fetched');
};

export const createRFQ = async (req, res) => {
  const rfqNumber = await generateRFQNumber();
  const rfq = await RFQ.create({ ...req.body, rfqNumber, createdBy: req.user._id });

  await logActivity({
    action: 'CREATE_RFQ',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'RFQ',
    targetId: rfq._id,
    targetLabel: rfq.rfqNumber,
    req
  });

  sendSuccess(res, rfq, 'RFQ created', 201);
};

export const getRFQById = async (req, res) => {
  const rfq = await RFQ.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('assignedVendors', 'name email category')
    .populate('awardedTo', 'name')
    .populate('awardedQuotation');
    
  if (!rfq) return sendError(res, 'RFQ not found', 404);

  // Check vendor access
  if (req.user.role === 'vendor' && !rfq.assignedVendors.some(v => v._id.toString() === req.user._id.toString())) {
    return sendError(res, 'Not authorized to view this RFQ', 403);
  }

  sendSuccess(res, rfq, 'RFQ fetched');
};

export const updateRFQ = async (req, res) => {
  let rfq = await RFQ.findById(req.params.id);
  if (!rfq) return sendError(res, 'RFQ not found', 404);

  if (rfq.status !== 'draft') {
    return sendError(res, 'Only draft RFQs can be updated directly', 400);
  }

  rfq = await RFQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  await logActivity({
    action: 'UPDATE_RFQ',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'RFQ',
    targetId: rfq._id,
    targetLabel: rfq.rfqNumber,
    req
  });

  sendSuccess(res, rfq, 'RFQ updated');
};

export const assignVendors = async (req, res) => {
  const { vendorIds } = req.body;
  const rfq = await RFQ.findById(req.params.id);
  
  if (!rfq) return sendError(res, 'RFQ not found', 404);
  if (rfq.status !== 'draft' && rfq.status !== 'open') {
    return sendError(res, 'Cannot assign vendors to this RFQ status', 400);
  }

  rfq.assignedVendors = vendorIds;
  
  // Publish RFQ if it was a draft
  if (rfq.status === 'draft') {
    rfq.status = 'open';
  }

  await rfq.save();

  // Fetch vendors to send emails
  const vendors = await Vendor.find({ _id: { $in: vendorIds } });
  vendors.forEach(vendor => {
    sendRFQNotification({
      to: vendor.email,
      vendorName: vendor.name,
      rfqTitle: rfq.title,
      deadline: rfq.deadline
    });
  });

  await logActivity({
    action: 'ASSIGN_VENDORS_TO_RFQ',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'RFQ',
    targetId: rfq._id,
    targetLabel: rfq.rfqNumber,
    metadata: { vendorCount: vendorIds.length },
    req
  });

  sendSuccess(res, rfq, 'Vendors assigned and notified');
};

export const getRFQQuotations = async (req, res) => {
  const quotations = await Quotation.find({ rfq: req.params.id })
    .populate('vendor', 'name email rating')
    .sort({ totalAmount: 1 }); // Sort by lowest amount

  sendSuccess(res, quotations, 'Quotations fetched');
};

export const closeRFQ = async (req, res) => {
  const rfq = await RFQ.findById(req.params.id);
  if (!rfq) return sendError(res, 'RFQ not found', 404);

  rfq.status = 'closed';
  await rfq.save();

  await logActivity({
    action: 'CLOSE_RFQ',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'RFQ',
    targetId: rfq._id,
    targetLabel: rfq.rfqNumber,
    req
  });

  sendSuccess(res, rfq, 'RFQ closed successfully');
};
