import type {
  CreateGoalRequest,
  UpdateGoalRequest,
} from '@api/contracts';
import { mockDb } from '../mockDb';
import { err, ok } from './types';
import type { MockRequestContext, MockResponseResult } from './types';

export const goalHandlers = {
  getGoals(): MockResponseResult {
    return ok(mockDb.getGoals(1));
  },

  createGoal(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body ?? {}) as Partial<CreateGoalRequest>;
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const category = typeof body.category === 'string' ? body.category.trim() : '';
    if (!title || title.length > 120 || !category || category.length > 60) {
      return err('Title and category are required', 400);
    }
    if (
      body.progress !== undefined &&
      (typeof body.progress !== 'number' ||
        !Number.isInteger(body.progress) ||
        body.progress < 0 ||
        body.progress > 100)
    ) {
      return err('Progress must be an integer between 0 and 100', 400);
    }
    if (
      (body.detail !== undefined &&
        (typeof body.detail !== 'string' || body.detail.length > 240)) ||
      (body.color !== undefined &&
        (typeof body.color !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(body.color)))
    ) {
      return err('Goal detail or color is invalid', 400);
    }
    const goal = mockDb.createGoal(1, { ...body, title, category });
    return ok(goal, 201);
  },

  updateGoal(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body ?? {}) as UpdateGoalRequest;
    if (Object.keys(body).length === 0) {
      return err('At least one field is required', 400);
    }
    if (
      (body.progress !== undefined &&
        (typeof body.progress !== 'number' ||
          !Number.isInteger(body.progress) ||
          body.progress < 0 ||
          body.progress > 100)) ||
      (body.title !== undefined &&
        (typeof body.title !== 'string' || !body.title.trim() || body.title.length > 120)) ||
      (body.category !== undefined &&
        (typeof body.category !== 'string' ||
          !body.category.trim() ||
          body.category.length > 60)) ||
      (body.detail !== undefined &&
        body.detail !== null &&
        (typeof body.detail !== 'string' || body.detail.length > 240)) ||
      (body.color !== undefined &&
        (typeof body.color !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(body.color)))
    ) {
      return err('Goal fields are invalid', 400);
    }
    const updated = mockDb.updateGoal(1, Number(ctx.params.id), body);
    if (!updated) return err('Goal not found', 404);
    return ok(updated);
  },

  deleteGoal(ctx: MockRequestContext): MockResponseResult {
    const deleted = mockDb.deleteGoal(1, Number(ctx.params.id));
    if (!deleted) return err('Goal not found', 404);
    return ok(undefined);
  },
};
