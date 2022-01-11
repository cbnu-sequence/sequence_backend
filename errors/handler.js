const createError = require('http-errors');

exports.notFound = (req, res, next) => next(createError(404));

exports.errorHandler = (err, req, res, next) => {
   const { status, message } = err;
   res.status(status || 500).json({ status, message });
};
