import { z } from "zod";

export const corporateSchema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  email: z.string().min(1, "Email is required").email().max(100),
  code: z.string().min(3, "Minimum 3 characters").max(10),
  phone: z.string().regex(/^[0-9]{9,15}$/, "Invalid phone number format"),
  industry_type: z.enum(["SOFTWARE", "CONSTRUCTION"]).optional(),
  company_size: z.number().min(0).max(99999),
  address: z.string().max(100).nullable().optional(),
});

export type CorporateSchema = z.infer<typeof corporateSchema>;
