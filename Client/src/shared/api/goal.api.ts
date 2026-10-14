import type {
  ApiResponse,
  CreateGoalRequest,
  GoalModel,
  UpdateGoalRequest,
} from '@api/contracts';
import { API_ENDPOINTS } from './endpoints';
import { api } from './client';

export const goalApi = {
  async getGoals() {
    return api.get<ApiResponse<GoalModel[]>>(API_ENDPOINTS.GOAL.ROOT);
  },

  async createGoal(dto: CreateGoalRequest) {
    return api.post<ApiResponse<GoalModel>>(API_ENDPOINTS.GOAL.ROOT, dto);
  },

  async updateGoal(id: number, dto: UpdateGoalRequest) {
    return api.put<ApiResponse<GoalModel>>(API_ENDPOINTS.GOAL.BY_ID(id), dto);
  },

  async deleteGoal(id: number) {
    return api.delete<ApiResponse<void>>(API_ENDPOINTS.GOAL.BY_ID(id));
  },
};
