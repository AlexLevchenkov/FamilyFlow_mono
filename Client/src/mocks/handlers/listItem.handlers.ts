import { mockDb } from '../mockDb';
import { ok, err } from './types';
import type { MockRequestContext, MockResponseResult } from './types';
import type { PaginatedListItemsResponse } from '@/api/contracts';

export const listItemHandlers = {
  getListItems(ctx: MockRequestContext): MockResponseResult {
    const listId = Number(ctx.query.listId);
    if (!listId) {
      return err('listId query parameter is required', 400);
    }

    const page = Number(ctx.query.page) || 1;
    const limit = 20;
    const allItems = mockDb.getItemsByListId(listId);

    const start = (page - 1) * limit;
    const paginated = allItems.slice(start, start + limit);

    const response: PaginatedListItemsResponse = {
      data: paginated,
      pagination: {
        total: allItems.length,
        page,
        limit,
        totalPages: Math.ceil(allItems.length / limit) || 1,
      },
    };

    return ok(response, 200);
  },

  getListItemById(ctx: MockRequestContext): MockResponseResult {
    const id = Number(ctx.params.id);
    const item = mockDb.getItemById(id);
    if (!item) {
      return err('Item not found', 404);
    }
    return ok(item, 200);
  },

  createListItem(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body || {}) as Record<string, unknown>;
    const listId = Number(body.listId);
    const title = String(body.title || '').trim();

    if (!listId || !title) {
      return err('listId and title are required', 400);
    }

    const created = mockDb.createItem({
      listId,
      title,
      completed: typeof body.completed === 'boolean' ? body.completed : false,
      description: body.description !== undefined ? String(body.description) : undefined,
      priority: body.priority !== undefined ? Number(body.priority) : 0,
      dueDate: body.dueDate ? String(body.dueDate) : undefined,
      position: body.position !== undefined ? Number(body.position) : 0,
    });
    return ok(created, 201);
  },

  updateListItem(ctx: MockRequestContext): MockResponseResult {
    const id = Number(ctx.params.id);
    const body = (ctx.body || {}) as Record<string, unknown>;

    const updated = mockDb.updateItem(id, {
      title: body.title !== undefined ? String(body.title) : undefined,
      completed: typeof body.completed === 'boolean' ? body.completed : undefined,
      description: body.description !== undefined ? String(body.description) : undefined,
      priority: body.priority !== undefined ? Number(body.priority) : undefined,
      dueDate: body.dueDate !== undefined ? (body.dueDate ? String(body.dueDate) : null) : undefined,
      position: body.position !== undefined ? Number(body.position) : undefined,
    });
    if (!updated) {
      return err('Item not found', 404);
    }
    return ok(updated, 200);
  },

  deleteListItem(ctx: MockRequestContext): MockResponseResult {
    const id = Number(ctx.params.id);
    const deleted = mockDb.deleteItem(id);
    if (!deleted) {
      return err('Item not found', 404);
    }
    return ok(undefined, 200);
  },
};
