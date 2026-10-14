import { mockDb } from '../mockDb';
import { ok, err } from './types';
import type { MockRequestContext, MockResponseResult } from './types';
import type { PaginatedListsResponse, ListType, AccessType } from '@/api/contracts';

export const listHandlers = {
  getUserLists(ctx: MockRequestContext): MockResponseResult {
    const page = Number(ctx.query.page) || 1;
    const limit = 10;
    const allLists = mockDb.getLists(1);

    const start = (page - 1) * limit;
    const paginated = allLists.slice(start, start + limit);

    const response: PaginatedListsResponse = {
      data: paginated,
      pagination: {
        total: allLists.length,
        page,
        limit,
        totalPages: Math.ceil(allLists.length / limit) || 1,
      },
    };

    return ok(response, 200);
  },

  getListById(ctx: MockRequestContext): MockResponseResult {
    const id = Number(ctx.params.id);
    const list = mockDb.getListById(id);
    if (!list) {
      return err('List not found', 404);
    }
    return ok(list, 200);
  },

  createList(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body || {}) as Record<string, unknown>;
    const title = String(body.title || '').trim();
    const type = body.type as ListType;
    const color = body.color !== undefined ? String(body.color) : undefined;
    const icon = body.icon !== undefined ? String(body.icon) : undefined;

    if (!title || !type) {
      return err('Title and type are required', 400);
    }

    const created = mockDb.createList(1, title, type, color, icon);
    return ok(created, 201);
  },

  updateList(ctx: MockRequestContext): MockResponseResult {
    const id = Number(ctx.params.id);
    const body = (ctx.body || {}) as Record<string, unknown>;
    const updated = mockDb.updateList(id, {
      title: body.title !== undefined ? String(body.title) : undefined,
      type: body.type !== undefined ? (body.type as ListType) : undefined,
      color: body.color !== undefined ? String(body.color) : undefined,
      icon: body.icon !== undefined ? String(body.icon) : undefined,
    });
    if (!updated) {
      return err('List not found', 404);
    }
    return ok(updated, 200);
  },

  deleteList(ctx: MockRequestContext): MockResponseResult {
    const id = Number(ctx.params.id);
    const deleted = mockDb.deleteList(id);
    if (!deleted) {
      return err('List not found', 404);
    }
    return ok(undefined, 200);
  },

  shareList(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body || {}) as Record<string, unknown>;
    const listId = Number(body.listId);
    const recipientId = Number(body.recipientId);
    const accessTypes = body.accessTypes as AccessType;

    if (!listId || !recipientId || !accessTypes) {
      return err('listId, recipientId and accessTypes are required', 400);
    }

    const shared = mockDb.shareList(listId, 1, recipientId, accessTypes);
    return ok(shared, 201);
  },

  removeSharingList(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body || {}) as Record<string, unknown>;
    const listId = Number(ctx.query.listId || body.listId);
    const ownerId = Number(ctx.query.ownerId || body.ownerId) || 1;
    const recipientId = Number(ctx.query.recipientId || body.recipientId);

    if (!listId || !recipientId) {
      return err('listId and recipientId are required', 400);
    }

    const removed = mockDb.removeShare(listId, ownerId, recipientId);
    if (!removed) {
      return err('Shared connection not found', 404);
    }
    return ok(undefined, 200);
  },
};
