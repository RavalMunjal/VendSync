export const sendSuccess = (res, data = {}, message = 'Action completed', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

export const sendError = (res, error = 'An error occurred', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error,
    code: statusCode
  });
};
