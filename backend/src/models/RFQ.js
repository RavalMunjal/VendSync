import mongoose from 'mongoose';

const rfqSchema = new mongoose.Schema({
  rfqNumber: { type: String, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  items: [{
    product: { type: String, required: true },
    qty: { type: Number, required: true },
    unit: { type: String, enum: ['pcs', 'kg', 'litre', 'set', 'box', 'metre'], required: true },
    specifications: { type: String }
  }],
  assignedVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
  deadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ['draft', 'open', 'closed', 'awarded'],
    default: 'draft'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  awardedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  awardedQuotation: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
  createdAt: { type: Date, default: Date.now }
});

// Indexes
rfqSchema.index({ status: 1 });
rfqSchema.index({ deadline: 1 });
rfqSchema.index({ createdBy: 1 });

const RFQ = mongoose.model('RFQ', rfqSchema);
export default RFQ;
