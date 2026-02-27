import apiClient from "@/lib/api";
import type { UserApiParams, UserListResponse } from "@/types/user";

export const getListUsers = async (
  params: UserApiParams = {},
): Promise<UserListResponse> => {
  const { corporate_id, ...queryParams } = params;

  const { data } = await apiClient.get<UserListResponse>(
    `/corporates/${corporate_id}/users`,
    {
      params: queryParams,
    },
  );

  return data;
};
