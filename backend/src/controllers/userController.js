import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const getUsers = async (req, res) => {
  const { role, isActive, page = 1, limit = 10 } = req.query;
  const query = {};

  if (role) query.role = role;
  if (isActive) query.isActive = isActive === 'true';

  const users = await User.find(query)
    .select('-password')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
    
  const total = await User.countDocuments(query);

  sendSuccess(res, { users, total, page: parseInt(page), pages: Math.ceil(total / limit) }, 'Users fetched');
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return sendError(res, 'User not found', 404);
  sendSuccess(res, user, 'User fetched');
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
  if (!user) return sendError(res, 'User not found', 404);
  sendSuccess(res, user, 'User updated');
};

export const toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return sendError(res, 'User not found', 404);
  
  user.isActive = !user.isActive;
  await user.save();
  sendSuccess(res, { isActive: user.isActive }, `User status changed to ${user.isActive}`);
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return sendError(res, 'User not found', 404);
  
  user.isActive = false; // Soft delete
  await user.save();
  sendSuccess(res, {}, 'User soft deleted');
};

export const getUsersByRole = async (req, res) => {
  const users = await User.find({ role: req.params.role }).select('-password');
  sendSuccess(res, users, 'Users fetched by role');
};

export const getUserStats = async (req, res) => {
  const stats = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 }, activeCount: { $sum: { $cond: ['$isActive', 1, 0] } } } }
  ]);
  sendSuccess(res, stats, 'User stats fetched');
};
