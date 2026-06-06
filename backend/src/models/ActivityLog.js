import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  performedByName: { type: String },
  targetModel: { type: String },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  targetLabel: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Indexes
activityLogSchema.index({ performedBy: 1 });
activityLogSchema.index({ targetModel: 1 });
activityLogSchema.index({ createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
