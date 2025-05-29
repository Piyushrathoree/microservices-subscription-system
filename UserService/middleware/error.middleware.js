export const errorHandler = (err, req, res, next) => {
    console.error(err);

    // MongoDB duplicate key error
    if (err.code === 11000) {
        return res.status(409).json({
            status: 'error',
            message: 'This email is already registered'
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid or expired token'
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
};
