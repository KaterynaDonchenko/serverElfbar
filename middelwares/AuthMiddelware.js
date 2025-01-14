const ApiError = require('../exeptions/ApiError');
const tokenService = require('../service/TokenService');

module.exports = function(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizeError());
        }

        const accessToken = authorizationHeader.split('')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizeError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizeError());
        }

        req.user = userData;
        return next();
    } catch (error) {
        return next(ApiError.UnauthorizeError());
    }
}