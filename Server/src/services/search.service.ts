import prisma from "@config/prisma";
import type {
  GlobalSearchParams,
  GlobalSearchResponse,
} from "@familyflow/contracts";

const MAX_RESULTS_PER_TYPE = 5;

type SearchType = keyof GlobalSearchResponse;

interface SearchRow {
  type: SearchType;
  id: number;
  title: string;
  date: Date | null;
}

class SearchService {
  async search(
    userId: number,
    { query }: GlobalSearchParams
  ): Promise<GlobalSearchResponse> {
    const escapedQuery = query.replace(/[\\%_]/g, "\\$&");
    const pattern = `%${escapedQuery}%`;

    const rows = await prisma.$queryRaw<SearchRow[]>`
      WITH user_families AS (
        SELECT DISTINCT "familyId"
        FROM "FamilyMember"
        WHERE "userId" = ${userId}
      ),
      family_users AS (
        SELECT DISTINCT "userId"
        FROM "FamilyMember"
        WHERE "userId" IS NOT NULL
          AND "familyId" IN (SELECT "familyId" FROM user_families)
      ),
      task_matches AS (
        SELECT 'tasks'::text AS type, task.id, task.title, task.date AS date
        FROM "Task" AS task
        WHERE task.title ILIKE ${pattern} ESCAPE E'\\\\'
          AND (
            task."userId" = ${userId}
            OR (
              task.visibility = 'shared'
              AND task."userId" IN (SELECT "userId" FROM family_users)
            )
          )
        ORDER BY task.title
        LIMIT ${MAX_RESULTS_PER_TYPE}
      ),
      goal_matches AS (
        SELECT 'goals'::text AS type, goal.id, goal.title, goal."dueDate" AS date
        FROM "Goal" AS goal
        WHERE goal.title ILIKE ${pattern} ESCAPE E'\\\\'
          AND (
            goal."createdById" = ${userId}
            OR goal."familyId" IN (SELECT "familyId" FROM user_families)
          )
        ORDER BY goal.title
        LIMIT ${MAX_RESULTS_PER_TYPE}
      ),
      event_matches AS (
        SELECT 'events'::text AS type, event.id, event.title, event.date AS date
        FROM "Event" AS event
        WHERE event.title ILIKE ${pattern} ESCAPE E'\\\\'
          AND (
            event."userId" = ${userId}
            OR (
              event.visibility = 'shared'
              AND event."userId" IN (SELECT "userId" FROM family_users)
            )
          )
        ORDER BY event.title
        LIMIT ${MAX_RESULTS_PER_TYPE}
      )
      SELECT type, id, title, date FROM task_matches
      UNION ALL
      SELECT type, id, title, date FROM goal_matches
      UNION ALL
      SELECT type, id, title, date FROM event_matches
    `;

    const results: GlobalSearchResponse = {
      tasks: [],
      goals: [],
      events: [],
    };

    for (const { type, id, title, date } of rows) {
      results[type].push({ id, title, date });
    }

    return results;
  }
}

export default new SearchService();
