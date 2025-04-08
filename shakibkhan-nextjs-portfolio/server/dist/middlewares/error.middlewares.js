"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const winston_logger_1 = __importDefault(require("../logger/winston.logger"));
const ApiError_1 = require("../utils/ApiError");
/**
 *
 * @param {Error | APIError} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 *
 * @description This middleware is responsible to catch the errors from any request handler wrapped inside the {@link asyncHandler}
 */
const errorHandler = (err, req, res, next) => {
    let error = err;
    // Check if the error is an instance of an ApiError class which extends native Error class
    if (!(error instanceof ApiError_1.ApiError)) {
        // if not
        // create a new ApiError instance to keep the consistency
        // assign an appropriate status code
        const statusCode = error.statusCode ? 400 : 500;
        // set a message from native Error instance or a custom one
        const message = error.message || "Something went wrong";
        error = new ApiError_1.ApiError(statusCode, message, (error === null || error === void 0 ? void 0 : error.errors) || [], err.stack);
    }
    // Now we are sure that the `error` variable will be an instance of ApiError class
    const response = Object.assign(Object.assign(Object.assign({}, error), { message: error.message }), (process.env.NODE_ENV === "development" ? { stack: error.stack } : {}));
    winston_logger_1.default.error(`${error.message}`);
    // Send error response
    return res.status(error.statusCode).json(response);
};
exports.errorHandler = errorHandler;
