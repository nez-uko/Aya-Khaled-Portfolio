const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);

    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    
    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 400;
        message = "Duplicate field value entered";
    } else if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = err.errors.map(e => e.message).join(', ');
    }
        console.log(err);
    
    res.status(statusCode).json({ message });
};

export {
    errorHandler,
    notFoundHandler,
};