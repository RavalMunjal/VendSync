import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
  rfq: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [{
    product: { type: String, required: true },
    qty: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number }
  }],
  deliveryDays: { type: Number, required: true },
  notes: { type: String },
  subtotal: { type: Number },
  gstPercent: { type: Number, default: 18 },
  gstAmount: { type: Number },
  totalAmount: { type: Number },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'selected', 'rejected', 'withdrawn'],
    default: 'draft'
  },
  submittedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook for auto-calculations
quotationSchema.pre('save', function (next) {
  let calcSubtotal = 0;
  if (this.items && this.items.length > 0) {
    this.items.forEach(item => {
      item.total = item.qty * item.unitPrice;
      calcSubtotal += item.total;
    });
  }
  this.subtotal = calcSubtotal;
  this.gstAmount = this.subtotal * (this.gstPercent / 100);
  this.totalAmount = this.subtotal + this.gstAmount;
  next();
});

// Compound index
quotationSchema.index({ rfq: 1, vendor: 1 }, { unique: true });

const Quotation = mongoose.model('Quotation', quotationSchema);
export default Quotation;
