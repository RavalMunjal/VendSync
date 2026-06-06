import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async ({ action, performedBy, performedByName, targetModel, targetId, targetLabel, metadata = {}, req = null }) => {
  try {
    const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : 'system';

    await ActivityLog.create({
      action,
      performedBy,
      performedByName,
      targetModel,
      targetId,
      targetLabel,
      metadata,
      ipAddress
    });
  } catch (error) {
    // Gracefully fail, never break main flow
    console.error(`Failed to log activity: ${action}`, error.message);
  }
};
