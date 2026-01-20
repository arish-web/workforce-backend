import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(12),
  role: z.enum(["ADMIN", "MANAGER", "EMPLOYEE"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
