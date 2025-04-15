import { errorHandler } from "../middlewares/error.middlewares";
/**
 * @description Common Error class to throw an error from anywhere.
 * The {@link errorHandler} middleware will catch this error at the central place and it will return an appropriate response to the client
 */

interface ApiSubError {
  field?: string;
  message: string;
}

class ApiError extends Error {
  readonly statusCode: number;
  readonly data: null;
  readonly success: boolean;
  readonly errors: ApiSubError[];

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: ApiSubError[] = [],
    stack?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message: string, errors: ApiSubError[] = []) {
    return new ApiError(400, message, errors);
  }

  static notFound(message: string = "Not Found") {
    return new ApiError(404, message);
  }

  static internal(message: string = "Internal Server Error") {
    return new ApiError(500, message);
  }
}

export { ApiError, ApiSubError };
