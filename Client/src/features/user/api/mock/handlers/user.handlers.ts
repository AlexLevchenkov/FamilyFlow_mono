import { mockDb } from '@mocks/database';
import { ok, err } from '@mocks/handlers/types';
import type {
  MockRequestContext,
  MockResponseResult,
} from '@mocks/handlers/types';
import type {
  GetUsersParams,
  PaginatedUsersResponse,
  RegisterUserBody,
} from '@types';

export const userHandlers = {
  getUsers(ctx: MockRequestContext<GetUsersParams>): MockResponseResult {
    const { page, partName, partEmail } = ctx.query;
    const limit = 20;

    const filtered = mockDb.users.getUsers(partName, partEmail);
    const start = (Number(page) - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const response: PaginatedUsersResponse = {
      data: paginated.map(u => ({ name: u.name, avatar: u.avatar })),
      pagination: {
        total: filtered.length,
        page: Number(page),
        limit,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    };

    return ok(response, 200);
  },

  getUserById(ctx: MockRequestContext): MockResponseResult {
    const id = Number(ctx.params.id);
    const user = mockDb.users.getUserById(id);
    if (!user) {
      return err('User not found', 404);
    }
    return ok(user, 200);
  },

  getMe(): MockResponseResult {
    const user = mockDb.users.getUserById(1);
    if (!user) {
      return err('User not found', 404);
    }
    return ok(user, 200);
  },

  register(ctx: MockRequestContext<RegisterUserBody>): MockResponseResult {
    const { email, name, password } = ctx.body || {};

    if (!email || !name || !password) {
      return err('Email and name are required', 400);
    }

    const existing = mockDb.users.getUserByEmail(email);
    if (existing) {
      return err('User already exists', 409);
    }

    const newUser = mockDb.users.createUser({ email, name, password });
    return ok({ name: newUser.name, avatar: newUser.avatar }, 201);
  },

  updateUser(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body || {}) as Record<string, unknown>;
    const updated = mockDb.users.updateUser({
      userId: Number(body.userId || 1),
      name: String(body.name || ''),
      email: String(body.email || ''),
      avatar: String(body.avatar || ''),
    });
    if (!updated) {
      return err('User not found', 404);
    }
    return ok(updated, 200);
  },

  deleteUser(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body || {}) as Record<string, unknown>;
    const userId = Number(ctx.query.userId || body.userId) || 1;
    mockDb.users.deleteUser(userId);
    return ok(undefined, 200);
  },
};
