import { mockDb } from '@mocks/database';
import { ok, err } from '@mocks/handlers/types';
import type {
  MockRequestContext,
  MockResponseResult,
} from '@mocks/handlers/types';
import type {
  GetUserTasksParams,
  PaginatedTasksResponse,
  CreateTaskBody,
  UpdateTaskBody,
} from '@types';

export const taskHandlers = {
  getTasks(ctx: MockRequestContext<GetUserTasksParams>): MockResponseResult {
    const { page } = ctx.query;
    const limit = 20;

    const filtered = mockDb.tasks.getTasks();
    const start = (Number(page) - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const response: PaginatedTasksResponse = {
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

  getTaskById(ctx: MockRequestContext): MockResponseResult {
    const taskId = Number(ctx.params.taskId);
    const task = mockDb.tasks.getTaskById(taskId);
    if (!task) {
      return err('Task not found', 404);
    }
    return ok(task, 200);
  },

  createTask(ctx: MockRequestContext<CreateTaskBody>): MockResponseResult {
    const { title, type, visibility, date } = ctx.body || {};
    if (!title || !type || !visibility || !date) {
      return err('Title, type, visibility and date are required', 400);
    }
    const newTask = mockDb.tasks.createTask({
      title,
      type,
      visibility,
      date,
    });
    return ok(newTask, 201);
  },

  updateTask(ctx: MockRequestContext<UpdateTaskBody>): MockResponseResult {
    const { id, title, type, visibility, status, date } = ctx.body || {};
    if (!id) {
      return err('Task ID is required', 400);
    }
    const updated = mockDb.tasks.updateTask({
      id,
      title: title || '',
      type: type || 'home',
      visibility: visibility || 'shared',
      status: status || false,
      date: date || new Date(),
    });
    if (!updated) {
      return err('Task not found', 404);
    }
    return ok(updated, 200);
  },

  deleteTask(ctx: MockRequestContext): MockResponseResult {
    const taskId = Number(ctx.params.taskId) || 1;
    mockDb.tasks.deleteTask(taskId);
    return ok(undefined, 200);
  },
};
