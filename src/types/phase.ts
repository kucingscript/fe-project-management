import type { ApiResponse } from "./base";

export interface Phase {
  phase_id: string;
  project_id: string;
  corporate_id: string;
  name: string;
  description: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  start_date: string;
  end_date: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface PhaseApiParams {
  page?: number;
  limit?: number;
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  project_id?: string;
}

export type PhaseListResponse = ApiResponse<Phase[]>;
export type PhaseResponse = ApiResponse<Phase>;

export interface PhasePayload {
  name: string;
  description: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  start_date: string;
  end_date: string;
  order_index: number;
}
