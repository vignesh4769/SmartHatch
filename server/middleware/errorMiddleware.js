const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    const errorResponse = {
      success: false,
      error: err.message,
      details: err.details,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    };

    console.error('API Error:', {
      ...errorResponse,
      userId: req.user?._id,
      body: req.body
    });

    res.json(errorResponse);
  };
  
  export { notFound, errorHandler };