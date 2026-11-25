import { mockDb } from '@mocks/database';
import { err, ok } from '@mocks/handlers/types';
import type {
  MockRequestContext,
  MockResponseResult,
} from '@mocks/handlers/types';
import type { GlobalSearchResponse } from '@types';

const MAX_RESULTS_PER_TYPE = 5;

export const searchHandlers = {
  search(ctx: MockRequestContext): MockResponseResult {
    const query = ctx.query.query?.trim().toLocaleLowerCase('uk-UA');
    if (!query) return err('Search query is required', 400);

    const family = mockDb.families.getMyFamily(1);
    const familyUserIds = new Set(
      family?.members
        ?.map(member => member.userId)
        .filter((userId): userId is number => userId !== null) ?? []
    );

    const findMatches = (
      items: Array<{ id: number; title: string; date: Date | null }>
    ) =>
      items
        .filter(item => item.title.toLocaleLowerCase('uk-UA').includes(query))
        .sort((a, b) => a.title.localeCompare(b.title, 'uk-UA'))
        .slice(0, MAX_RESULTS_PER_TYPE);

    const results: GlobalSearchResponse = {
      tasks: findMatches(
        mockDb.tasks
          .getTasks()
          .filter(
            task =>
              task.userId === 1 ||
              (task.visibility === 'shared' && familyUserIds.has(task.userId))
          )
          .map(({ id, title, date }) => ({ id, title, date }))
      ),
      goals: findMatches(
        mockDb.goals
          .getGoals(family?.id)
          .filter(goal => goal.createdById === 1 || goal.familyId === family?.id)
          .map(({ id, title, dueDate }) => ({ id, title, date: dueDate }))
      ),
      events: findMatches(
        mockDb.events
          .getEvents()
          .filter(
            event =>
              event.userId === 1 ||
              (event.visibility === 'shared' &&
                familyUserIds.has(event.userId))
          )
          .map(({ id, title, date }) => ({ id, title, date }))
      ),
    };

    return ok(results);
  },
};
