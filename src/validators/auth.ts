import { z } from "zod";
import { registerCorporateSchema } from "./corporate";

export const loginSchema = z.object({
  email: z.email(),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const userSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phone: z.string().regex(/^[0-9]{9,15}$/, "Invalid phone number format"),
  email: z.email().max(50),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
  address: z.string().max(100).nullable().optional(),
});

export const registerUserValidation = z.object({
  corporate: registerCorporateSchema,
  user: userSchema,
});

export type RegisterSchema = z.infer<typeof registerUserValidation>;
