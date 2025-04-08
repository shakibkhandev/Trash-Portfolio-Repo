import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


export const accessAdminPanel = asyncHandler(async (req: any, res: any) => {
  if (!req.body) {
    throw new ApiError(
      400,
      "No Data found. Username and password are required"
    );
  }
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username !== adminUsername || password !== adminPassword) {
    throw new ApiError(401, "Invalid username or password");
  }

  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, "JWT_SECRET is not defined");
  }

  const token = jwt.sign({ username, password }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.status(200).json(new ApiResponse(200, {access_token: token}, "Access granted"));
});
