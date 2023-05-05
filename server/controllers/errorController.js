const OperationalError = require('../utils/operationalErrorResponse');

const handleDuplicateFields = (e) => {
  let value = Object.values(e.keyValue)[0];

  const message = ` { ${value} } já foi usado. Por favor experimente outro`;

  return new OperationalError(message, 509);
};

const handleValidationError = (e) => {
  const errors = Object.values(e.errors).map((val) => val.message);
  const message = errors.join('. ');

  return new OperationalError(message, 400);
};

const sendErrorDev = (e, res) => {
  res.status(e.statusCode).json({
    status: e.status,
    message: e.message,
    error: e,
    stack: e.stack,
  });
};

const sendErrorProd = (e, res) => {
  if (e.isOperationalError) {
    res.status(e.statusCode).json({
      status: e.status,
      message: e.message,
    });
  } else {
    console.error(`ERROR 👋:`, e);

    res.status(500).json({
      status: 'error',

      message: `Algo acorreu mal. ${e.message}`,
    });
  }
};

exports.globalErrorHandler = (e, req, res, next) => {
  e.statusCode = e.statusCode || 500;
  e.status = e.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(e, res);
  } else {
    let error = { ...e, message: e.message };

    if (e.code === 11000) error = handleDuplicateFields(error);
    if (e.name === 'ValidationError') error = handleValidationError(error);
    sendErrorProd(error, res);
  }
};