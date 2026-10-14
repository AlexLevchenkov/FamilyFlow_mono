import { mockDb } from '../mockDb';
import { ok, err } from './types';
import type { MockRequestContext, MockResponseResult } from './types';
import type { PaginatedUsersResponse } from '@api/contracts';

export const userHandlers = {
  getUsers(ctx: MockRequestContext): MockResponseResult {
    const page = Number(ctx.query.page) || 1;
    const partName = ctx.query.partName;
    const partEmail = ctx.query.partEmail;
    const limit = 10;

    const filtered = mockDb.getUsers(partName, partEmail);
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const response: PaginatedUsersResponse = {
      data: paginated.map(u => ({ name: u.name, avatar: u.avatar })),
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    };

    return ok(response, 200);
  },

  getUserById(ctx: MockRequestContext): MockResponseResult {
    const id = Number(ctx.params.id);
    const user = mockDb.getUserById(id);
    if (!user) {
      return err('User not found', 404);
    }
    return ok(user, 200);
  },

  register(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body || {}) as Record<string, unknown>;
    const email = String(body.email || '').trim();
    const name = String(body.name || '').trim();

    if (!email || !name) {
      return err('Email and name are required', 400);
    }

    const existing = mockDb.getUserByEmail(email);
    if (existing) {
      return err('User already exists', 409);
    }

    const newUser = mockDb.createUser(email, name);
    return ok({ name: newUser.name, avatar: newUser.avatar }, 201);
  },

  updateUser(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body || {}) as Record<string, unknown>;
    const currentUserId = Number(body.userId) || 1;
    const updated = mockDb.updateUser(currentUserId, {
      name: body.name !== undefined ? String(body.name) : undefined,
      email: body.email !== undefined ? String(body.email) : undefined,
      avatar: body.avatar !== undefined ? String(body.avatar) : undefined,
    });
    if (!updated) {
      return err('User not found', 404);
    }
    return ok(updated, 200);
  },

  deleteUser(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body || {}) as Record<string, unknown>;
    const userId = Number(ctx.query.userId || body.userId) || 1;
    const deleted = mockDb.deleteUser(userId);
    if (!deleted) {
      return err('User not found', 404);
    }
    return ok(undefined, 200);
  },
};
