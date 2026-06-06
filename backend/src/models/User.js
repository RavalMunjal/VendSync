import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: {
    type: String,
    enum: ['procurement_officer', 'vendor', 'manager', 'admin'],
    default: 'procurement_officer'
  },
  isActive: { type: Boolean, default: true },
  avatar: { type: String, default: '' },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);
export default User;
