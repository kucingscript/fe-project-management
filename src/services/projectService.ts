import apiClient from "@/lib/api";
import type { ApiResponse } from "@/types/base";
import type {
  ProjectApiParams,
  ProjectAssignmentPayload,
  ProjectFromTemplatePayload,
  ProjectListResponse,
  ProjectPayload,
  ProjectResponse,
} from "@/types/project";

export const getListProjects = async (
  params: ProjectApiParams = {},
): Promise<ProjectListResponse> => {
  const { corporate_id, ...queryParams } = params;

  const { data } = await apiClient.get<ProjectListResponse>(
    `/corporates/${corporate_id}/projects`,
    {
      params: queryParams,
    },
  );

  return data;
};

export const getDetailProject = async (
  corporate_id: string,
  project_id: string,
): Promise<ProjectResponse> => {
  const { data } = await apiClient.get<ProjectResponse>(
    `/corporates/${corporate_id}/projects/${project_id}`,
  );

  return data;
};

export const createProject = async (
  corporate_id: string,
  payload: ProjectPayload,
): Promise<ProjectResponse> => {
  const { data } = await apiClient.post<ProjectResponse>(
    `/corporates/${corporate_id}/projects/create`,
    payload,
  );

  return data;
};

export const createProjectFromTemplate = async (
  corporate_id: string,
  payload: ProjectFromTemplatePayload,
): Promise<ProjectResponse> => {
  const { data } = await apiClient.post<ProjectResponse>(
    `/corporates/${corporate_id}/projects/from-template`,
    payload,
  );

  return data;
};

export const updateProject = async (
  corporate_id: string,
  project_id: string,
  payload: Partial<ProjectPayload>,
): Promise<ProjectResponse> => {
  const { data } = await apiClient.put<ProjectResponse>(
    `/corporates/${corporate_id}/projects/${project_id}`,
    payload,
  );

  return data;
};

export const assignUsersToProject = async (
  corporate_id: string,
  project_id: string,
  payload: ProjectAssignmentPayload,
): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.post<ApiResponse<null>>(
    `/corporates/${corporate_id}/projects/${project_id}/assignment`,
    payload,
  );

  return data;
};
