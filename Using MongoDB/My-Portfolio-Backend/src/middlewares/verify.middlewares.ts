import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const verifyAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, "JWT_SECRET is not defined");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        throw new ApiError(401, "Unauthorized");
      }

      if (
        typeof decoded === "object" &&
        "username" in decoded &&
        decoded.username !== process.env.ADMIN_USERNAME &&
        decoded.password !== process.env.ADMIN_PASSWORD
      ) {
        throw new ApiError(401, "Unauthorized");
      }

      next();
    } catch (error) {
      throw new ApiError(
        401,
        "Unauthorized. You are not an admin. If you are then check your JWT token"
      );
    }
  }
);