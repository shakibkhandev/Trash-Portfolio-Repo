import { NextFunction, Request, Response } from "express";
import logger from "../logger/winston.logger";
import { ApiError } from "../utils/ApiError";

import { asyncHandler } from "../utils/asyncHandler";

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
const errorHandler = (
  err: Error | ApiError | any,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  let error = err;

  // Check if the error is an instance of an ApiError class which extends native Error class
  if (!(error instanceof ApiError)) {
    // if not
    // create a new ApiError instance to keep the consistency

    // assign an appropriate status code
    const statusCode = (error as ApiError).statusCode ? 400 : 500;

    // set a message from native Error instance or a custom one
    const message = error.message || "Something went wrong";
    error = new ApiError(
      statusCode,
      message,
      (error as any)?.errors || [],
      err.stack
    );
  }

  // Now we are sure that the `error` variable will be an instance of ApiError class
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}), // Error stack traces should be visible in development for debugging
  };

  logger.error(`${error.message}`);

  // Send error response
  return res.status((error as ApiError).statusCode).json(response);
};

export { errorHandler };