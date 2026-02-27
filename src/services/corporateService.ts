import apiClient from "@/lib/api";
import type {
  CorporateApiParams,
  CorporateListResponse,
  CorporatePayload,
  CorporateResponse,
} from "@/types/corporate";

export const getListCorporates = async (
  params: CorporateApiParams = {},
): Promise<CorporateListResponse> => {
  const { data } = await apiClient.get<CorporateListResponse>("/corporates", {
    params,
  });

  return data;
};

export const createCorporate = async (
  payload: CorporatePayload,
): Promise<CorporateResponse> => {
  const { data } = await apiClient.post<CorporateResponse>(
    `/corporates/register`,
    payload,
  );
  return data;
};
