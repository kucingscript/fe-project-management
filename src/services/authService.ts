import apiClient from "@/lib/api";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
} from "@/types/auth";

export const loginUser = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const res = await apiClient.post<LoginResponse>("/login", credentials);
  return res.data;
};

export const registerUser = async (
  credentials: RegisterCredentials,
): Promise<RegisterResponse> => {
  const res = await apiClient.post<RegisterResponse>("/register", credentials);
  return res.data;
};
