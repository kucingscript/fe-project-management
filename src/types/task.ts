import type { ApiResponse } from "./base";

export interface Task {
  task_id: string;
  project_id: string;
  task_group_id: string;
  corporate_id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  start_date: string;
  due_date: string;
  completed_at: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TaskApiParams {
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
  sort?: "created_at" | "due_date" | "priority" | "updated_at";
  status?: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  assigned_to?: string;
  corporate_id?: string;
  project_id?: string;
  task_group_id?: string;
}

export type TaskListResponse = ApiResponse<Task[]>;
