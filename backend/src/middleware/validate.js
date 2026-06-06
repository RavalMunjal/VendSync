import { validationResult } from 'express-validator';
import { sendError } from '../utils/responseHelper.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return sendError(res, errorMessages, 400);
  }
  next();
};
