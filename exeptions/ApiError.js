module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors; 
    }

    static UnauthorizeError() {
        return new ApiError(401, 'the user is not authorized')
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors)
    }
} 