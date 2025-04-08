"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.signUpSchema = exports.signInSchema = void 0;
const zod_1 = require("zod");
exports.signInSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(255),
});
exports.signUpSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(255),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(255).optional(),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.resetPasswordSchema = zod_1.z.object({
    newPassword: zod_1.z.string().min(8).max(255),
    confirmPassword: zod_1.z.string().min(8).max(255),
    token: zod_1.z.string().min(64).max(64),
});
