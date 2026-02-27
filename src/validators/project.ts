import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required").max(100),
  project_type: z.enum(["CONSTRUCTION", "SOFTWARE", "CUSTOM"]).optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  status: z
    .enum(["DRAFT", "ON_HOLD", "ACTIVE", "COMPLETED", "ARCHIVED"])
    .optional(),
});

export const projectSchemaFromTemplate = z.object({
  project_template_id: z
    .string()
    .min(1, "Project template is required")
    .max(50),
});

export const projectAssignmentSchema = z.object({
  access_type: z.enum(["EDITOR", "VIEWER"]).optional(),
  user_ids: z
    .array(
      z.object({
        user_id: z.string().min(1, "User ID is required").max(50),
      }),
    )
    .min(1, "Select at least one user to assign"),
});

export type ProjectCreateSchema = z.Infer<typeof projectFormSchema>;
export type ProjectUpdateSchema = z.Infer<typeof projectFormSchema>;
export type ProjectCreateSchemaFromTemplate = z.Infer<
  typeof projectSchemaFromTemplate
>;
export type ProjectAssignmentSchema = z.Infer<typeof projectAssignmentSchema>;
