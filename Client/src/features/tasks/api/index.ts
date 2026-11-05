import { API_ENDPOINTS, api } from '@api';
import type {
  ApiResponse,
  CreateTaskBody,
  GetUserTasksParams,
  PaginatedTasksResponse,
  TaskModel,
  UpdateTaskBody,
} from '@types';

export * from './taskKeys';

export const tasksApi = {
  /**
   * Search and paginate user tasks (GET /task)
   */
  async getTasks(params?: GetUserTasksParams) {
    const { data } = await api.get<ApiResponse<PaginatedTasksResponse>>(
      API_ENDPOINTS.TASK.ROOT,
      { params }
    );

    return data.data;
  },

  /**
   * Retrieve single task by ID (GET /task/:id)
   */
  async getTaskById(id: number) {
    const { data } = await api.get<ApiResponse<TaskModel>>(
      API_ENDPOINTS.TASK.BY_ID(id)
    );

    return data.data;
  },

  /**
   * Create a new task (POST /task)
   */
  async createTask(dto: CreateTaskBody) {
    const { data } = await api.post<ApiResponse<TaskModel>>(
      API_ENDPOINTS.TASK.ROOT,
      dto
    );

    return data.data;
  },

  /**
   * Update task by ID (PUT /task/:id)
   */
  async updateTask(id: number, dto: UpdateTaskBody) {
    const { data } = await api.put<ApiResponse<TaskModel>>(
      API_ENDPOINTS.TASK.BY_ID(id),
      dto
    );

    return data.data;
  },

  /**
   * Delete task by ID (DELETE /task/:id)
   */
  async deleteTask(id: number) {
    const { data } = await api.delete<ApiResponse<void>>(
      API_ENDPOINTS.TASK.BY_ID(id)
    );

    return data.data;
  },
};
