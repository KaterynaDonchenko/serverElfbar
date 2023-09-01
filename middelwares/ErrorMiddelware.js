const ApiError = require('../exeptions/ApiError');

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, error: err.errors});
    }
    return res.status(500).json({message: 'unexpected error occurred'})
}