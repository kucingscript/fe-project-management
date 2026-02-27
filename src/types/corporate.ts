import type { ApiResponse } from "./base";

export interface Corporate {
  corporate_id: string;
  corporate_name: string;
  corporate_code: string;
  corporate_status: "ACTIVE" | "INACTIVE";
  role_name: string;
  role_code: string;
  role_scope: string;
  assigned_at: string;
}

export type CorporateListResponse = ApiResponse<Corporate[]>;

export interface CorporateApiParams {
  q?: string;
  status?: "ACTIVE" | "INACTIVE";
  page?: number;
  limit?: number;
}

export interface CorporatePayload {
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  industry_type: "SOFTWARE" | "CONSTRUCTION";
  company_size: number;
}

export interface CorporateRegisterResponse {
  corporate_id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  logo_url: string | null;
  industry_type: "SOFTWARE" | "CONSTRUCTION";
  company_size: number;
  subscription_plan: string | null;
  subscription_started_at: string | null;
  subscription_expired_at: string | null;
  created_at: string;
  updated_at: string;
}

export type CorporateResponse = ApiResponse<CorporateRegisterResponse>;
