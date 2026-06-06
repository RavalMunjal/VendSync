import ActivityLog from '../models/ActivityLog.js';
import { sendSuccess } from '../utils/responseHelper.js';

export const getActivityLogs = async (req, res) => {
  const { action, targetModel, page = 1, limit = 20 } = req.query;
  const query = {};

  if (action) query.action = action;
  if (targetModel) query.targetModel = targetModel;

  const logs = await ActivityLog.find(query)
    .populate('performedBy', 'name email role')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await ActivityLog.countDocuments(query);

  sendSuccess(res, {
    logs,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  }, 'Activity logs fetched');
};

export const clearActivityLogs = async (req, res) => {
  // Only keep logs from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await ActivityLog.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });

  sendSuccess(res, { deletedCount: result.deletedCount }, 'Old activity logs cleared');
};
