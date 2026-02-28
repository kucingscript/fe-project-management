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
    .optional(),
});

export const assignmentSchema = z.object({
  access_type: z.enum(["OWNER", "EDITOR", "VIEWER"]),
  user_ids: z
    .array(
      z.object({
        user_id: z.string().min(1, "User selection is required"),
      }),
    )
    .min(1, "Please select at least one user to assign"),
});

export const createTaskGroupWithAssignSchema = taskGroupFormSchema.and(
  taskGroupAssignmentSchema,
);

export type CreateTaskGroupWithAssignSchema = z.Infer<
  typeof createTaskGroupWithAssignSchema
>;

export type AssignSchema = z.Infer<typeof assignmentSchema>;
export type TaskGroupUpdateSchema = z.Infer<typeof taskGroupFormSchema>;
