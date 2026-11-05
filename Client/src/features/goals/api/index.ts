import { API_ENDPOINTS, api } from '@api';
import type {
  ApiResponse,
  CreateGoalBody,
  GetGoalsParams,
  GoalModel,
  PaginatedGoalsResponse,
  UpdateGoalBody,
} from '@types';

export * from './goalKeys';

export const goalsApi = {
  /**
   * Search and paginate user goals (GET /goal)
   */
  async getGoals(params?: GetGoalsParams) {
    const { data } = await api.get<ApiResponse<PaginatedGoalsResponse>>(
      API_ENDPOINTS.GOAL.ROOT,
      { params }
    );

    return data.data;
  },

  /**
   * Retrieve single goal by ID (GET /goal/:id)
   */
  async getGoalById(id: number) {
    const { data } = await api.get<ApiResponse<GoalModel>>(
      API_ENDPOINTS.GOAL.BY_ID(id)
    );

    return data.data;
  },

  /**
   * Create a new goal (POST /goal)
   */
  async createGoal(dto: CreateGoalBody) {
    const { data } = await api.post<ApiResponse<GoalModel>>(
      API_ENDPOINTS.GOAL.ROOT,
      dto
    );

    return data.data;
  },

  /**
   * Update goal by ID (PUT /goal/:id)
   */
  async updateGoal(id: number, dto: UpdateGoalBody) {
    const { data } = await api.put<ApiResponse<GoalModel>>(
      API_ENDPOINTS.GOAL.BY_ID(id),
      dto
    );

    return data.data;
  },

  /**
   * Delete goal by ID (DELETE /goal/:id)
   */
  async deleteGoal(id: number) {
    const { data } = await api.delete<ApiResponse<void>>(
      API_ENDPOINTS.GOAL.BY_ID(id)
    );

    return data.data;
  },
};
