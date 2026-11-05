import { mockDb } from '@mocks/database';
import { ok, err } from '@mocks/handlers/types';
import type {
  MockRequestContext,
  MockResponseResult,
} from '@mocks/handlers/types';
import type {
  CreateGoalBody,
  GetGoalsParams,
  PaginatedGoalsResponse,
  UpdateGoalBody,
} from '@types';

export const goalHandlers = {
  getGoals(ctx: MockRequestContext<GetGoalsParams>): MockResponseResult {
    const { page } = ctx.query;
    const limit = 20;
    const filtered = mockDb.goals.getGoals();
    const start = (Number(page) - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const response: PaginatedGoalsResponse = {
      data: paginated,
      pagination: {
        total: filtered.length,
        page: Number(page),
        limit,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    };

    return ok(response, 200);
  },

  getGoalById(ctx: MockRequestContext): MockResponseResult {
    const id = Number(ctx.params.id);
    const goal = mockDb.goals.getGoalById(id);
    if (!goal) {
      return err('Goal not found', 404);
    }
    return ok(goal, 200);
  },

  createGoal(ctx: MockRequestContext<CreateGoalBody>): MockResponseResult {
    const {
      title,
      description,
      type,
      status,
      currentValue,
      targetValue,
      unit,
      currency,
      startsAt,
      dueDate,
    } = ctx.body || {};
    const newGoal = mockDb.goals.createGoal({
      title: String(title || ''),
      description: String(description || ''),
      type: type || 'AMOUNT',
      status: status || 'ACTIVE',
      currentValue: Number(currentValue || 0),
      targetValue: Number(targetValue || 0),
      unit: String(unit || ''),
      currency: String(currency || ''),
      startsAt: new Date(startsAt || ''),
      dueDate: new Date(dueDate || ''),
    });
    return ok(newGoal, 201);
  },

  updateGoal(ctx: MockRequestContext<UpdateGoalBody>): MockResponseResult {
    const { id } = ctx.params;
    const {
      title,
      description,
      status,
      currentValue,
      targetValue,
      unit,
      currency,
      dueDate,
    } = ctx.body || {};
    const updated = mockDb.goals.updateGoal({
      id: Number(id),
      title: title || 'Test title',
      description: description || null,
      status: status || 'ACTIVE',
      currentValue: currentValue || null,
      targetValue: targetValue || null,
      unit: unit || null,
      currency: currency || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    });
    if (!updated) {
      return err('Goal not found', 404);
    }
    return ok(updated, 200);
  },

  deleteGoal(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body || {}) as Record<string, unknown>;
    const id = Number(ctx.query.id || body.id);
    mockDb.goals.deleteGoal(id);
    return ok(undefined, 200);
  },
};
