import apiClient from "@/lib/api";
import type { ApiResponse } from "@/types/base";
import type {
  TaskGroupListResponse,
  TaskGroupApiParams,
  TaskGroupPayload,
  TaskGroupResponse,
  TaskGroupAssignmentPayload,
} from "@/types/task-group";

export const getListTaskGroup = async (
  corporate_id: string,
  project_id: string,
  params: TaskGroupApiParams = {},
): Promise<TaskGroupListResponse> => {
  const { data } = await apiClient.get<TaskGroupListResponse>(
    `/corporates/${corporate_id}/projects/${project_id}/task-groups`,
    {
      params,
    },
  );

  return data;
};

export const getDetailTaskGroup = async (
  corporate_id: string,
  project_id: string,
  task_group_id: string,
): Promise<TaskGroupResponse> => {
  const { data } = await apiClient.get<TaskGroupResponse>(
    `/corporates/${corporate_id}/projects/${project_id}/task-groups/${task_group_id}`,
  );

  return data;
};

export const createTaskGroup = async (
  corporate_id: string,
  project_id: string,
  payload: TaskGroupPayload,
): Promise<TaskGroupResponse> => {
  const { data } = await apiClient.post<TaskGroupResponse>(
    `/corporates/${corporate_id}/projects/${project_id}/task-groups`,
    payload,
  );

  return data;
};

export const updateTaskGroup = async (
  corporate_id: string,
  project_id: string,
  task_group_id: string,
  payload: TaskGroupPayload,
): Promise<TaskGroupResponse> => {
  const { data } = await apiClient.put<TaskGroupResponse>(
    `/corporates/${corporate_id}/projects/${project_id}/task-groups/${task_group_id}`,
    payload,
  );

  return data;
};

export const assignUsersToTaskGroup = async (
  corporate_id: string,
  project_id: string,
  task_group_id: string,
  payload: TaskGroupAssignmentPayload,
): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.post<ApiResponse<null>>(
    `/corporates/${corporate_id}/projects/${project_id}/task-groups/${task_group_id}/assignment`,
    payload,
  );

  return data;
};
