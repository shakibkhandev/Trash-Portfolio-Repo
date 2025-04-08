import crypto from "crypto";
import jwt from "jsonwebtoken";
import { USER_TEMPORARY_TOKEN_EXPIRY } from "../constants";
import { prisma } from "../services/prisma";
import { ApiError } from "./ApiError";

interface User {
  id: string;
  email: string;
}

// Type definition for the return object
interface TokenResponse {
  unHashedToken: string;
  hashedToken: string;
  tokenExpiry: number;
}

// Function to generate temporary token
export function generateTemporaryToken(): TokenResponse {
  // This token should be client-facing (e.g., for email verification)
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  // This should stay in the DB to compare at the time of verification
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  // This is the expiry time for the token (20 minutes)
  const tokenExpiry = Date.now() + USER_TEMPORARY_TOKEN_EXPIRY;

  return { unHashedToken, hashedToken, tokenExpiry };
}

export const generateAccessToken = (user: any) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "1d",
    }
  );
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "10d",
  });
};

export const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in the database
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating the access token"
    );
  }
};

// Helper function to generate JWT token
export const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string, // Use env variable for secret
    {
      expiresIn: "1h", // Token expires in 1 hour
    }
  );
};
