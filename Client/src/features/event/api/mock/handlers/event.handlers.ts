import { mockDb } from '@mocks/database';
import { ok, err } from '@mocks/handlers/types';
import type {
  MockRequestContext,
  MockResponseResult,
} from '@mocks/handlers/types';
import type {
  CreateEventBody,
  PaginatedEventsResponse,
  UpdateEventBody,
} from '@types';

export const eventHandlers = {
  getEvents(ctx: MockRequestContext): MockResponseResult {
    const { page, limit: queryLimit, from, to } = ctx.query;
    const limit = Number(queryLimit) || 20;

    let filtered = mockDb.events.getEvents();

    if (from) {
      const fromDate = new Date(from);
      filtered = filtered.filter(e => new Date(e.date) >= fromDate);
    }
    if (to) {
      const toDate = new Date(to);
      filtered = filtered.filter(e => new Date(e.date) <= toDate);
    }

    filtered.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const currentPage = Number(page) || 1;
    const start = (currentPage - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const response: PaginatedEventsResponse = {
      data: paginated,
      pagination: {
        total: filtered.length,
        page: currentPage,
        limit,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    };

    return ok(response, 200);
  },

  getEventById(ctx: MockRequestContext): MockResponseResult {
    const eventId = Number(ctx.params.eventId);
    const event = mockDb.events.getEventById(eventId);
    if (!event) {
      return err('Event not found', 404);
    }
    return ok(event, 200);
  },

  createEvent(ctx: MockRequestContext<CreateEventBody>): MockResponseResult {
    const { title, color, date, repeatability, visibility } = ctx.body || {};
    if (!title || !color || !date || !repeatability) {
      return err('Title, color, date and repeatability are required', 400);
    }
    const newEvent = mockDb.events.createEvent({
      title,
      color,
      date,
      repeatability,
      visibility: visibility || 'shared',
    });
    return ok(newEvent, 201);
  },

  updateEvent(ctx: MockRequestContext<UpdateEventBody>): MockResponseResult {
    const { id } = ctx.params;
    const { title, color, date, repeatability, visibility } = ctx.body || {};
    const updated = mockDb.events.updateEvent({
      id: Number(id),
      title: String(title),
      color: String(color),
      date: new Date(date || ''),
      repeatability: repeatability || 'none',
      visibility: visibility || 'shared',
    });
    if (!updated) {
      return err('Event not found', 404);
    }
    return ok(updated, 200);
  },

  deleteEvent(ctx: MockRequestContext): MockResponseResult {
    const eventId = Number(ctx.params.eventId) || 1;
    mockDb.events.deleteEvent(eventId);
    return ok(undefined, 200);
  },
};

