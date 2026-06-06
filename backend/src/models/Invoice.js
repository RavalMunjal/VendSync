import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [{
    product: String,
    qty: Number,
    unit: String,
    unitPrice: Number,
    total: Number
  }],
  subtotal: { type: Number, required: true },
  gstPercent: { type: Number, default: 18 },
  gstAmount: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'sent', 'paid'], default: 'draft' },
  dueDate: { type: Date },
  sentAt: { type: Date },
  paidAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook for auto-calculations
invoiceSchema.pre('save', function (next) {
  let calcSubtotal = 0;
  if (this.items && this.items.length > 0) {
    this.items.forEach(item => {
      item.total = item.qty * item.unitPrice;
      calcSubtotal += item.total;
    });
  }
  this.subtotal = calcSubtotal;
  this.gstAmount = this.subtotal * (this.gstPercent / 100);
  this.grandTotal = this.subtotal + this.gstAmount;
  next();
});

// Indexes
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ vendor: 1 });
invoiceSchema.index({ purchaseOrder: 1 });

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
