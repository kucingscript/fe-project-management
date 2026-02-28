import apiClient from "@/lib/api";
import type {
  PhaseApiParams,
  PhaseListResponse,
  PhasePayload,
  PhaseResponse,
} from "@/types/phase";

export const getListPhases = async (
  corporate_id: string,
  project_id: string,
  params: PhaseApiParams = {},
): Promise<PhaseListResponse> => {
  const { data } = await apiClient.get<PhaseListResponse>(
    `/corporates/${corporate_id}/projects/${project_id}/phases`,
    {
      params,
    },
  );

  return data;
};

export const createPhase = async (
  corporate_id: string,
  project_id: string,
  payload: PhasePayload,
): Promise<PhaseResponse> => {
  const { data } = await apiClient.post<PhaseResponse>(
    `/corporates/${corporate_id}/projects/${project_id}/phases`,
    payload,
  );

  return data;
};

export const updatePhase = async (
  corporate_id: string,
  project_id: string,
  phase_id: string,
  payload: PhasePayload,
): Promise<PhaseResponse> => {
  const { data } = await apiClient.put<PhaseResponse>(
    `/corporates/${corporate_id}/projects/${project_id}/phases/${phase_id}`,
    payload,
  );

  return data;
};
