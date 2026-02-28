import { z } from "zod";

export const taskGroupFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(255).optional(),
  order_index: z.number().optional(),
  phase_id: z.string().optional(),
});

export const taskGroupAssignmentSchema = z.object({
  access_type: z.enum(["OWNER", "EDITOR", "VIEWER"]).optional(),
  user_ids: z
    .array(
      z.object({
        user_id: z.string().min(1, "User ID is required").max(50),
      }),
    )
    .min(1, "Select at least one user to assign"),
});

export type TaskGroupCreateSchema = z.infer<typeof taskGroupFormSchema>;
export type TaskGroupUpdateSchema = z.infer<typeof taskGroupFormSchema>;
export type TaskGroupAssignmentSchema = z.infer<
  typeof taskGroupAssignmentSchema
>;
