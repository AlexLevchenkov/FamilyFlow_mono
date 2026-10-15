import type {
  CreateGoalRequest,
  GoalModel,
  UpdateGoalRequest,
} from '@familyflow/contracts';
import { interfaceToOpenAPI } from '@/utils';

const date = new Date().toISOString();
const goal: GoalModel = {
  id: 1,
  familyId: 1,
  title: 'Family trip',
  category: 'Travel',
  progress: 25,
  detail: 'Save together',
  color: '#7656d0',
  createdAt: date,
  updatedAt: date,
};

export const goalSchemas = {
  GoalResponse: interfaceToOpenAPI<GoalModel>(goal),
  CreateGoalRequest: interfaceToOpenAPI<CreateGoalRequest>({
    title: goal.title,
    category: goal.category,
    progress: goal.progress,
    detail: goal.detail ?? undefined,
    color: goal.color,
  }),
  UpdateGoalRequest: interfaceToOpenAPI<UpdateGoalRequest>({
    title: goal.title,
    category: goal.category,
    progress: goal.progress,
    detail: goal.detail,
    color: goal.color,
  }),
};
