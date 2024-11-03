export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: err.message
      });
    }
  
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
        error: 'Authentication Error',
        details: 'Invalid or expired token'
      });
    }
  
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(409).json({
        error: 'Conflict Error',
        details: 'Duplicate key violation'
      });
    }
  
    res.status(500).json({
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  };