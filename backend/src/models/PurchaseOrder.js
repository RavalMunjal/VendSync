import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, unique: true },
  rfq: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ' },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  quotation: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
  approval: { type: mongoose.Schema.Types.ObjectId, ref: 'Approval' },
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
  deliveryDays: { type: Number },
  status: {
    type: String,
    enum: ['generated', 'sent', 'acknowledged', 'completed'],
    default: 'generated'
  },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sentAt: { type: Date },
  acknowledgedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook for auto-calculations
purchaseOrderSchema.pre('save', function (next) {
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
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ vendor: 1 });
purchaseOrderSchema.index({ createdAt: -1 });

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
export default PurchaseOrder;
