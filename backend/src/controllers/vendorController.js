import Vendor from '../models/Vendor.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Quotation from '../models/Quotation.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { logActivity } from '../utils/activityLogger.js';

export const getVendors = async (req, res) => {
  const { category, status, search, page = 1, limit = 10 } = req.query;
  const query = {};

  if (category) query.category = category;
  if (status) query.status = status;
  if (search) query.name = { $regex: search, $options: 'i' };

  const vendors = await Vendor.find(query)
    .populate('createdBy', 'name email')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Vendor.countDocuments(query);

  sendSuccess(res, { vendors, total, page: parseInt(page), pages: Math.ceil(total / limit) }, 'Vendors fetched');
};

export const createVendor = async (req, res) => {
  const vendor = await Vendor.create({ ...req.body, createdBy: req.user._id });

  await logActivity({
    action: 'CREATE_VENDOR',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'Vendor',
    targetId: vendor._id,
    targetLabel: vendor.name,
    req
  });

  sendSuccess(res, vendor, 'Vendor created', 201);
};

export const getVendorCategories = async (req, res) => {
  const categories = await Vendor.distinct('category');
  sendSuccess(res, categories, 'Categories fetched');
};

export const getVendorStats = async (req, res) => {
  const stats = await Vendor.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  const categoryStats = await Vendor.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  
  sendSuccess(res, { overall: stats[0], byCategory: categoryStats }, 'Vendor stats fetched');
};

export const getVendorById = async (req, res) => {
  const vendor = await Vendor.findById(req.params.id).populate('createdBy', 'name email');
  if (!vendor) return sendError(res, 'Vendor not found', 404);
  sendSuccess(res, vendor, 'Vendor fetched');
};

export const updateVendor = async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!vendor) return sendError(res, 'Vendor not found', 404);

  await logActivity({
    action: 'UPDATE_VENDOR',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'Vendor',
    targetId: vendor._id,
    targetLabel: vendor.name,
    req
  });

  sendSuccess(res, vendor, 'Vendor updated');
};

export const toggleVendorStatus = async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return sendError(res, 'Vendor not found', 404);

  vendor.status = vendor.status === 'active' ? 'inactive' : 'active';
  await vendor.save();

  await logActivity({
    action: 'TOGGLE_VENDOR_STATUS',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'Vendor',
    targetId: vendor._id,
    targetLabel: vendor.name,
    metadata: { newStatus: vendor.status },
    req
  });

  sendSuccess(res, { status: vendor.status }, `Vendor status changed to ${vendor.status}`);
};

export const deleteVendor = async (req, res) => {
  const activePOs = await PurchaseOrder.countDocuments({ vendor: req.params.id, status: { $nin: ['completed'] } });
  if (activePOs > 0) return sendError(res, 'Cannot delete vendor with active purchase orders', 400);

  const vendor = await Vendor.findByIdAndDelete(req.params.id);
  if (!vendor) return sendError(res, 'Vendor not found', 404);

  await logActivity({
    action: 'DELETE_VENDOR',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'Vendor',
    targetId: vendor._id,
    targetLabel: vendor.name,
    req
  });

  sendSuccess(res, {}, 'Vendor deleted');
};

export const getVendorQuotations = async (req, res) => {
  const quotations = await Quotation.find({ vendor: req.params.id }).populate('rfq', 'rfqNumber title');
  sendSuccess(res, quotations, 'Quotations fetched');
};

export const getVendorPurchaseOrders = async (req, res) => {
  const pos = await PurchaseOrder.find({ vendor: req.params.id }).populate('rfq', 'rfqNumber title');
  sendSuccess(res, pos, 'Purchase Orders fetched');
};
