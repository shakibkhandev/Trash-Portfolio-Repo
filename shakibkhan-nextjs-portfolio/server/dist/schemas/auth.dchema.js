"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpSchema = exports.signInSchema = void 0;
const zod_1 = require("zod");
exports.signInSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(255)
});
exports.signUpSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(255),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(255).optional()
});
