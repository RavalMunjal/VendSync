import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return sendError(res, 'User already exists', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  if (user) {
    sendSuccess(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    }, 'User registered successfully', 201);
  } else {
    sendError(res, 'Invalid user data', 400);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {
    if (!user.isActive) {
      return sendError(res, 'Account is deactivated', 403);
    }

    user.lastLogin = new Date();
    await user.save();

    sendSuccess(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    }, 'Login successful');
  } else {
    sendError(res, 'Invalid email or password', 401);
  }
};

export const getMe = async (req, res) => {
  sendSuccess(res, req.user, 'User details fetched successfully');
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return sendError(res, 'Invalid current password', 400);
  }

  user.password = newPassword;
  await user.save();

  sendSuccess(res, {}, 'Password updated successfully');
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  // Simulated email send
  sendSuccess(res, {}, 'Password reset email sent (simulated)');
};
