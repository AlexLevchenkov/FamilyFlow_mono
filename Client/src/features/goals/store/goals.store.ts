import { create } from 'zustand';
import { getApiErrorMessage, goalApi } from '@api';
import type { CreateGoalRequest, GoalModel } from '@api/contracts';

interface GoalsState {
  goals: GoalModel[];
  loading: boolean;
  error: string | null;
  loadGoals: () => Promise<void>;
  createGoal: (goal: CreateGoalRequest) => Promise<void>;
}

export const useGoalsStore = create<GoalsState>((set) => ({
  goals: [],
  loading: false,
  error: null,

  async loadGoals() {
    set({ loading: true, error: null });
    try {
      const response = await goalApi.getGoals();
      set({ goals: response.data.data, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error, 'Не вдалося завантажити цілі'), loading: false });
    }
  },

  async createGoal(goal) {
    set({ error: null });
    try {
      const response = await goalApi.createGoal(goal);
      set(state => ({ goals: [...state.goals, response.data.data] }));
    } catch (error) {
      set({ error: getApiErrorMessage(error, 'Не вдалося створити ціль') });
    }
  },
}));
