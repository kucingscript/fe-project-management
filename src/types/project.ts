import type { ApiResponse } from "./base";

export interface Project {
  project_id: string;
  corporate_id: string;
  project_code: string;
  name: string;
  description: string;
  project_type: "CONSTRUCTION" | "SOFTWARE" | "CUSTOM";
  start_date: string;
  end_date: string;
  status: "DRAFT" | "ON_HOLD" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
  progress_percentage: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface ProjectExtend extends Project {
  project_template_id: string | null;
}

export interface ProjectApiParams {
  q?: string;
  page?: number;
  limit?: number;
  status?: "DRAFT" | "ON_HOLD" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
  project_type?: "CONSTRUCTION" | "SOFTWARE" | "CUSTOM";
  corporate_id?: string;
}

export type ProjectListResponse = ApiResponse<ProjectExtend[]>;
export type ProjectResponse = ApiResponse<ProjectExtend>;

export interface ProjectPayload {
  name: string;
  description: string;
  project_type: "CONSTRUCTION" | "SOFTWARE" | "CUSTOM";
  start_date: string;
  end_date: string;
  status: "DRAFT" | "ON_HOLD" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
}

export interface ProjectFromTemplatePayload {
  project_template_id: string;
}

export interface ProjectAssignmentPayload {
  access_type: "EDITOR" | "VIEWER";
  user_ids: {
    user_id: string;
  }[];
}
