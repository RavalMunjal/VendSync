import { sendError } from '../utils/responseHelper.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let error = err.message || 'Server Error';
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = `Resource not found with id of ${err.value}`;
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = 'Duplicate field value entered';
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = Object.values(err.errors).map(val => val.message).join(', ');
    statusCode = 400;
  }

  return sendError(res, error, statusCode);
};
