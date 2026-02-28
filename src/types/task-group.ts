import type { ApiResponse } from "./base";

export interface TaskGroup {
  task_group_id: string;
  project_id: string;
  phase_id: string | null;
  corporate_id: string;
  name: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface TaskGroupApiParams {
  page?: number;
  limit?: number;
  project_id?: string;
  phase_id?: string;
}

export type TaskGroupListResponse = ApiResponse<TaskGroup[]>;
export type TaskGroupResponse = ApiResponse<TaskGroup>;

export interface TaskGroupPayload {
  name: string;
  description: string;
  order_index: number;
  phase_id: string;
}

export interface TaskGroupAssignmentPayload {
  access_type: "OWNER" | "EDITOR" | "VIEWER";
  user_ids: {
    user_id: string;
  }[];
}
