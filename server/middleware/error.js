class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || 'Internal Server Error';
    err.statusCode = err.statusCode || 500;
    if(err.code === 11000) {
        err.message = 'Duplicate field value entered';
        err= new ErrorHandler(400, err.message);
    }
    if (err.name === 'jasonWebTokenError') {
        err.message = 'Json Web Token is invalid, try again';
        err = new ErrorHandler(400, err.message);
    }
    if (err.name === 'TokenExpiredError') {
        err.message = 'Json Web Token is expired, try again';
        err = new ErrorHandler(400, err.message);
    }
    if(err.name === 'CastError'){
        err.message = 'Resource not found';
        err = new ErrorHandler(400, err.message);
    }

    const errorMessage = err.errors ? Object.values(err.errors).map((val) => val.message).join(', ')     : err.message;

    return res.status(err.statusCode).json({
        success: false,
        error: errorMessage  
    });
    }

export default ErrorHandler;