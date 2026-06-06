import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from '../utils/responseHelper.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return sendError(res, 'Not authorized, user not found', 401);
      }
      
      if (!user.isActive) {
        return sendError(res, 'Not authorized, account is deactivated', 403);
      }
      
      req.user = user;
      next();
    } catch (error) {
      return sendError(res, 'Not authorized, token failed', 401);
    }
  }

  if (!token) {
    return sendError(res, 'Not authorized, no token', 401);
  }
};
