import apiClient from "@/lib/api";
import type {
  CorporateApiParams,
  CorporateListResponse,
} from "@/types/corporate";

export const getListCorporates = async (
  params: CorporateApiParams = {},
): Promise<CorporateListResponse> => {
  const { data } = await apiClient.get<CorporateListResponse>("/corporates", {
    params,
  });

  return data;
};
