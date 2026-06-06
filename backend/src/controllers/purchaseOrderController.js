import PurchaseOrder from '../models/PurchaseOrder.js';
import Approval from '../models/Approval.js';
import Quotation from '../models/Quotation.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { generatePONumber } from '../utils/generateNumber.js';
import { logActivity } from '../utils/activityLogger.js';

export const getPurchaseOrders = async (req, res) => {
  const { status, vendor, page = 1, limit = 10 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (vendor) query.vendor = vendor;

  // Vendors can only see their own POs
  if (req.user.role === 'vendor') {
    query.vendor = req.user._id;
  }

  const pos = await PurchaseOrder.find(query)
    .populate('vendor', 'name email phone')
    .populate('rfq', 'rfqNumber title')
    .populate('generatedBy', 'name')
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await PurchaseOrder.countDocuments(query);

  sendSuccess(res, { pos, total, page: parseInt(page), pages: Math.ceil(total / limit) }, 'Purchase Orders fetched');
};

export const createPO = async (req, res) => {
  const { approvalId } = req.body;

  const approval = await Approval.findById(approvalId).populate('rfq');
  if (!approval) return sendError(res, 'Approval not found', 404);

  if (approval.status !== 'approved') {
    return sendError(res, 'Cannot create PO without an approved request', 400);
  }

  const existingPO = await PurchaseOrder.findOne({ approval: approvalId });
  if (existingPO) {
    return sendError(res, 'PO already exists for this approval', 400);
  }

  const quotation = await Quotation.findById(approval.quotation);
  const poNumber = await generatePONumber();

  const po = await PurchaseOrder.create({
    poNumber,
    rfq: approval.rfq._id,
    vendor: approval.vendor,
    quotation: approval.quotation,
    approval: approval._id,
    items: quotation.items,
    subtotal: quotation.subtotal,
    gstPercent: quotation.gstPercent,
    gstAmount: quotation.gstAmount,
    grandTotal: quotation.totalAmount,
    deliveryDays: quotation.deliveryDays,
    generatedBy: req.user._id,
    status: 'generated'
  });

  await logActivity({
    action: 'CREATE_PURCHASE_ORDER',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'PurchaseOrder',
    targetId: po._id,
    targetLabel: po.poNumber,
    req
  });

  sendSuccess(res, po, 'Purchase Order created successfully', 201);
};

export const getPOById = async (req, res) => {
  const po = await PurchaseOrder.findById(req.params.id)
    .populate('vendor', 'name email address phone')
    .populate('rfq', 'rfqNumber title')
    .populate('generatedBy', 'name email');

  if (!po) return sendError(res, 'Purchase Order not found', 404);

  // Check access
  if (req.user.role === 'vendor' && po.vendor._id.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized to view this PO', 403);
  }

  sendSuccess(res, po, 'Purchase Order fetched');
};

export const updatePOStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['generated', 'sent', 'acknowledged', 'completed'];

  if (!validStatuses.includes(status)) {
    return sendError(res, 'Invalid status', 400);
  }

  const po = await PurchaseOrder.findById(req.params.id);
  if (!po) return sendError(res, 'Purchase Order not found', 404);

  // Vendors can only acknowledge or complete
  if (req.user.role === 'vendor' && !['acknowledged', 'completed'].includes(status)) {
    return sendError(res, 'Vendors can only mark PO as acknowledged or completed', 403);
  }

  po.status = status;
  
  if (status === 'sent') po.sentAt = new Date();
  if (status === 'acknowledged') po.acknowledgedAt = new Date();

  await po.save();

  await logActivity({
    action: `UPDATE_PO_STATUS_${status.toUpperCase()}`,
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'PurchaseOrder',
    targetId: po._id,
    targetLabel: po.poNumber,
    req
  });

  sendSuccess(res, po, `Purchase Order marked as ${status}`);
};
