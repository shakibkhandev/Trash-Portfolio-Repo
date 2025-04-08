import { z } from "zod";
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
});

export const signUpSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(255).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8).max(255),
  confirmPassword: z.string().min(8).max(255),
  token: z.string().min(64).max(64),
});
