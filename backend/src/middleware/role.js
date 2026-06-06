import { sendError } from '../utils/responseHelper.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, `User role ${req.user.role} is not authorized to access this route`, 403);
    }
    next();
  };
};
