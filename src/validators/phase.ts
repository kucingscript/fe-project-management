import { z } from "zod";

export const phaseFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(255).optional(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]).optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  order_index: z.number().optional(),
});

export type PhaseCreateSchema = z.Infer<typeof phaseFormSchema>;
export type PhaseUpdateSchema = z.Infer<typeof phaseFormSchema>;
