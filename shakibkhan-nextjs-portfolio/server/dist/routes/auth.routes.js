"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("../controllers/auth.controllers");
const verify_middlewares_1 = require("../middlewares/verify.middlewares");
exports.authRoutes = express_1.default.Router();
exports.authRoutes.post("/sign-in", auth_controllers_1.signInFunction);
exports.authRoutes.post("/sign-up", auth_controllers_1.signUpFunction);
exports.authRoutes.post("/sign-out", auth_controllers_1.signOutFunction);
exports.authRoutes.post("/forget-password", auth_controllers_1.forgotPasswordRequest);
exports.authRoutes.post("/reset-password/:resetToken", auth_controllers_1.resetPassword);
exports.authRoutes.post("/refresh-token", auth_controllers_1.refreshAccessToken);
exports.authRoutes.post("/verify-email/:verificationToken", auth_controllers_1.verifyEmail);
exports.authRoutes.post("/admin-access-request", verify_middlewares_1.verifyJWT, auth_controllers_1.adminAccessRequest);
exports.authRoutes.get("/verify-access", verify_middlewares_1.verifyJWT, auth_controllers_1.verifyToken);
