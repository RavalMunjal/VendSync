import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gstNumber: { type: String, required: true, uppercase: true },
  category: {
    type: String,
    enum: ['IT Hardware', 'Office Supplies', 'Services', 'Software', 'Logistics', 'Furniture', 'Other'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalOrders: { type: Number, default: 0 },
  totalSpend: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Indexes
vendorSchema.index({ status: 1 });
vendorSchema.index({ category: 1 });
vendorSchema.index({ createdAt: -1 });

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
