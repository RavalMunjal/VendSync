import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema({
  rfq: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
  quotation: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  totalAmount: { type: Number, required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  remarks: { type: String },
  requestedAt: { type: Date, default: Date.now },
  actionAt: { type: Date }
});

// Indexes
approvalSchema.index({ status: 1 });
approvalSchema.index({ requestedBy: 1 });
approvalSchema.index({ rfq: 1 });

const Approval = mongoose.model('Approval', approvalSchema);
export default Approval;
