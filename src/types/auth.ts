import type { ApiResponse } from "./base";
import type { CorporatePayload, CorporateRegisterResponse } from "./corporate";

// STORE
export interface UserPayload {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  user_type: string;
}

// LOGIN
export interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginData {
  user: UserPayload;
  token: string;
}

export type LoginResponse = ApiResponse<LoginData>;

// REGISTER PAYLOAD
interface RegisterUserPayload {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
}

export interface RegisterCredentials {
  corporate: CorporatePayload;
  user: RegisterUserPayload;
}

// REGISTER RESPONSE
interface RegisterUserResponseData {
  user_id: string;
  email: string;
  status: string;
}

interface RegisterData {
  corporate: CorporateRegisterResponse;
  user: RegisterUserResponseData;
}

export type RegisterResponse = ApiResponse<RegisterData>;
