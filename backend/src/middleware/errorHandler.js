export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message = error.message || 'Something went wrong.';

  if (process.env.NODE_ENV !== 'production') {
    console.error('Unhandled error:', error);
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    code,
  });
}
