import type { ApiResponse } from "./base";

export interface User {
  user_id: string;
  assigned_at: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  role_name: string;
  role_code: string;
  role_scope: string;
}

export type UserListResponse = ApiResponse<User[]>;

export interface UserApiParams {
  q?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  page?: number;
  limit?: number;
  corporate_id?: string;
}
