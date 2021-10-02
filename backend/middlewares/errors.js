const ErrorHandler = require('../utils/ErrorHandler')

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    // console.log(err)

    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    })
  }
  if (process.env.NODE_ENV === 'PRODUCTION') {
    let error = { ...err }

    error.message = err.message
    //Wrong Mongoose Object ID error
    if (err.name === 'CastError') {
      const message = `Resource not found: invalid ${err.path}`
      error = new ErrorHandler(message, 400)
    }
    // Handling Validation Mongoose Error
    if ((err.name = 'ValidationError')) {
      const message = Object.values(err.errors).map((value) => value.message)
      error = new ErrorHandler(message, 400)
    }
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    })
  }
}