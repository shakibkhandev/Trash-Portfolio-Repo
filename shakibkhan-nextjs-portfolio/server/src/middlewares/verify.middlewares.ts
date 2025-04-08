import jwt from "jsonwebtoken";
import { prisma } from "../services/prisma";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const verifyJWT = asyncHandler(async (req: any, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    if (typeof decodedToken !== "object" || !("id" in decodedToken)) {
      throw new ApiError(401, "Invalid access token");
    }
    const user = await prisma.user.findFirst({
      where: {
        id: decodedToken.id,
      },
      select: {
        id: true,
        email: true,
        isAdmin: true,
      },
    });
    if (!user) {
      // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
      // Then they will get a new access token which will allow them to refresh the access token without logging out the user
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user; // Assign the user to the extended Request interface
    next();
  } catch (error) {
    // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
    // Then they will get a new access token which will allow them to refresh the access token without logging out the user
    throw new ApiError(
      401,
      (error as Error)?.message || "Invalid access token"
    );
  }
});
