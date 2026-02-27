import { z } from "zod";

// Corporate at registration
export const registerCorporateSchema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  email: z.string().min(1, "Email is required").email().max(100),
  code: z.string().min(3, "Minimum 3 characters").max(10),
  phone: z.string().regex(/^[0-9]{9,15}$/, "Invalid phone number format"),
  industry_type: z.enum(["SOFTWARE", "CONSTRUCTION"]).optional(),
  company_size: z.number().min(0).max(99999),
  address: z.string().max(100).nullable().optional(),
});

// Corporate endpoint

export const corporateFormSchema = z.object({
  code: z.string().min(3, "Minimum 3 characters").max(10),
  name: z.string().min(5, "Minimum 5 characters").max(100),
  address: z.string().min(1, "Address is required").max(100),
  phone: z.string().regex(/^[0-9]{11,15}$/, "Invalid phone number format"),
  industry_type: z.enum(["SOFTWARE", "CONSTRUCTION"]).optional(),
  company_size: z
    .number()
    .positive("Must be a positive number")
    .gte(3, "Minimum 3 employees"),
  email: z.email(),
});

export type CorporateCreateSchema = z.infer<typeof corporateFormSchema>;
