import express from "express";
import {
  adminAccessRequest,
  forgotPasswordRequest,
  refreshAccessToken,
  resetPassword,
  signInFunction,
  signOutFunction,
  signUpFunction,
  verifyEmail,
  verifyToken,
} from "../controllers/auth.controllers";
import { verifyJWT } from "../middlewares/verify.middlewares";

export const authRoutes = express.Router();

authRoutes.post("/sign-in", signInFunction);
authRoutes.post("/sign-up", signUpFunction);
authRoutes.post("/sign-out", signOutFunction);
authRoutes.post("/forget-password", forgotPasswordRequest);
authRoutes.post("/reset-password/:resetToken", resetPassword);
authRoutes.post("/refresh-token", refreshAccessToken);
authRoutes.post("/verify-email/:verificationToken", verifyEmail);
authRoutes.post("/admin-access-request", verifyJWT, adminAccessRequest);
authRoutes.get("/verify-access", verifyJWT, verifyToken);
