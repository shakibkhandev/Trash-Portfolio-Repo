"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
/**
 * A higher-order function that wraps Express route handlers.
 * It catches any errors thrown in asynchronous code and passes them to the error-handling middleware.
 *
 * @param requestHandler - The asynchronous request handler.
 * @returns A function that handles the request, catches errors, and forwards them to the next middleware.
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};
exports.asyncHandler = asyncHandler;
