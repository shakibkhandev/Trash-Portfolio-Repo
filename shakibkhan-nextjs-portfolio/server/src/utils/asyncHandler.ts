import { NextFunction, Request, Response } from "express";

/**
 * A higher-order function that wraps Express route handlers.
 * It catches any errors thrown in asynchronous code and passes them to the error-handling middleware.
 *
 * @param requestHandler - The asynchronous request handler.
 * @returns A function that handles the request, catches errors, and forwards them to the next middleware.
 */
const asyncHandler = (
  requestHandler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };