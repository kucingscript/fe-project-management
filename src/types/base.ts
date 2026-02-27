export interface ApiResponse<T> {
  code: number;
  message: string;
  requestId: string;
  data: T;
  pageInfo?: PageInfo;
}

export interface PageInfo {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}
