// Global error handler - must be in app.js 
function errorHandler(req, res, next){
    console.error(`ERROR: ${err.message}`);


    const status = err.status || 500;
    res.status(status).json({
        sucess: false,
        error: err.message || "server error"
    });
}

module.exports = errorHandler;