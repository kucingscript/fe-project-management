export interface ApiErrorResponse {
  code: number;
  message: string;
  requestId: string;
  errors?: string[];
}
