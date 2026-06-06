import Approval from '../models/Approval.js';
import Quotation from '../models/Quotation.js';
import RFQ from '../models/RFQ.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { logActivity } from '../utils/activityLogger.js';
import { sendApprovalNotification } from '../utils/emailService.js';

export const getApprovals = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = {};

  if (status) query.status = status;

  const approvals = await Approval.find(query)
    .populate('rfq', 'rfqNumber title')
    .populate('vendor', 'name')
    .populate('requestedBy', 'name')
    .populate('approvedBy', 'name')
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ requestedAt: -1 });

  const total = await Approval.countDocuments(query);

  sendSuccess(res, { approvals, total, page: parseInt(page), pages: Math.ceil(total / limit) }, 'Approvals fetched');
};

export const requestApproval = async (req, res) => {
  const { quotationId } = req.body;

  const quotation = await Quotation.findById(quotationId).populate('rfq');
  if (!quotation) return sendError(res, 'Quotation not found', 404);

  if (quotation.status !== 'submitted') {
    return sendError(res, 'Quotation is not in submitted state', 400);
  }

  const existingApproval = await Approval.findOne({ rfq: quotation.rfq._id, status: 'pending' });
  if (existingApproval) {
    return sendError(res, 'An approval request is already pending for this RFQ', 400);
  }

  const approval = await Approval.create({
    rfq: quotation.rfq._id,
    quotation: quotation._id,
    vendor: quotation.vendor,
    totalAmount: quotation.totalAmount,
    requestedBy: req.user._id
  });

  quotation.status = 'selected';
  await quotation.save();

  await logActivity({
    action: 'REQUEST_APPROVAL',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'Approval',
    targetId: approval._id,
    targetLabel: quotation.rfq.rfqNumber,
    req
  });

  sendSuccess(res, approval, 'Approval requested successfully', 201);
};

export const processApproval = async (req, res) => {
  const { action, remarks } = req.body; // action: 'approved' | 'rejected'
  
  if (!['approved', 'rejected'].includes(action)) {
    return sendError(res, 'Invalid action', 400);
  }

  const approval = await Approval.findById(req.params.id)
    .populate('requestedBy', 'email name')
    .populate('rfq', 'rfqNumber title');
    
  if (!approval) return sendError(res, 'Approval not found', 404);
  if (approval.status !== 'pending') return sendError(res, `Approval is already ${approval.status}`, 400);

  approval.status = action;
  approval.approvedBy = req.user._id;
  approval.remarks = remarks;
  approval.actionAt = new Date();
  await approval.save();

  const quotation = await Quotation.findById(approval.quotation);
  const rfq = await RFQ.findById(approval.rfq);

  if (action === 'approved') {
    rfq.status = 'awarded';
    rfq.awardedTo = approval.vendor;
    rfq.awardedQuotation = approval.quotation;
    await rfq.save();
  } else {
    quotation.status = 'rejected';
    await quotation.save();
  }

  // Notify requester
  sendApprovalNotification({
    to: approval.requestedBy.email,
    status: action,
    rfqTitle: approval.rfq.title,
    remarks
  });

  await logActivity({
    action: `PROCESS_APPROVAL_${action.toUpperCase()}`,
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'Approval',
    targetId: approval._id,
    targetLabel: approval.rfq.rfqNumber,
    req
  });

  sendSuccess(res, approval, `Approval ${action} successfully`);
};
