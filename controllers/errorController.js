const AppError = require('../Utiles/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const message = `Duplicated Name , ${err.keyValue.email} Already Exists`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input Data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // Check if the request is for an API route
  if (req.originalUrl.startsWith('/api')) {
    // Send JSON response for API requests
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // Render error.ejs for non-API requests in development
  res.status(err.statusCode).render('errorpage', {
    error: {
      statusCode: err.statusCode,
      status: err.status,
      message: err.message,
      stack: err.stack,
    },
  });
};
const handleJWTError = () => new AppError('Invalid Token. Please Login again', 401);

const handleJWTExpiredError = () => new AppError('Expired Token. Please Login again', 401);

const sendErrorProd = (err, req, res) => {
  //FOR API
  if (req.originalUrl.startsWith('/api')) {
    //Marked as Operational, if trusted : send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
  }
  //Programmin side or other unkown error: dont leak the error details,
  console.log('ERROR', err);
  return res.status(err.statusCode).json({
    status: 'Error',
    message: 'Something went wrong',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidatorError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};
