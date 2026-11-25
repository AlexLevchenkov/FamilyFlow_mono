import {
  authHandlers,
  eventHandlers,
  familyHandlers,
  goalHandlers,
  searchHandlers,
  taskHandlers,
  userHandlers,
} from './handlers';
import type { MockRequestContext, MockResponseResult } from './handlers';

type RouteHandler = (
  ctx: MockRequestContext<unknown>
) => MockResponseResult | Promise<MockResponseResult>;

interface RouteDefinition {
  method: string;
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
  description: string;
}

const routes: RouteDefinition[] = [];

function register<T = unknown>(
  method: string,
  path: string,
  handler: (
    ctx: MockRequestContext<T>
  ) => MockResponseResult | Promise<MockResponseResult>
) {
  const paramNames: string[] = [];
  const regexPattern = path.replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
    paramNames.push(paramName);
    return '([^/]+)';
  });

  routes.push({
    method: method.toUpperCase(),
    pattern: new RegExp(`^${regexPattern}$`),
    paramNames,
    handler: ctx => handler({ ...ctx, body: ctx.body as T | null | undefined }),
    description: `${method.toUpperCase()} ${path}`,
  });
}

// 1. Auth routes
register('POST', '/auth/login', authHandlers.login);
register('GET', '/auth/logout', authHandlers.logout);
register('POST', '/auth/refresh-token', authHandlers.refreshToken);
register('POST', '/auth/forgot-password', authHandlers.forgotPassword);
register('POST', '/auth/reset-password', authHandlers.resetPassword);
register('GET', '/auth/verify-email', authHandlers.verifyEmail);

// 2. Event routes
register('GET', '/event/:id', eventHandlers.getEventById);
register('GET', '/event', eventHandlers.getEvents);
register('POST', '/event', eventHandlers.createEvent);
register('PUT', '/event/:id', eventHandlers.updateEvent);
register('DELETE', '/event/:id', eventHandlers.deleteEvent);

// 3. Family routes
register('GET', '/family/my', familyHandlers.getMyFamily);
register('POST', '/family', familyHandlers.createFamily);
register('GET', '/family/:familyId', familyHandlers.getFamilyById);
register('PUT', '/family/:familyId', familyHandlers.updateFamily);
register('DELETE', '/family/:familyId', familyHandlers.deleteFamily);
register('GET', '/family/:familyId/members', familyHandlers.getMembers);
register('POST', '/family/:familyId/members', familyHandlers.addMember);
register(
  'PUT',
  '/family/:familyId/members/:memberId',
  familyHandlers.updateMemberRole
);
register(
  'DELETE',
  '/family/:familyId/members/:memberId',
  familyHandlers.removeMember
);

// 4. Goal routes
register('GET', '/goal/:id', goalHandlers.getGoalById);
register('GET', '/goal', goalHandlers.getGoals);
register('POST', '/goal', goalHandlers.createGoal);
register('PUT', '/goal/:id', goalHandlers.updateGoal);
register('DELETE', '/goal/:id', goalHandlers.deleteGoal);

// 5. Search routes
register('GET', '/search', searchHandlers.search);

// 6. Task routes
register('GET', '/task/:id', taskHandlers.getTaskById);
register('GET', '/task', taskHandlers.getTasks);
register('POST', '/task', taskHandlers.createTask);
register('PUT', '/task/:id', taskHandlers.updateTask);
register('DELETE', '/task/:id', taskHandlers.deleteTask);

// 7. User routes
register('GET', '/user/me', userHandlers.getMe);
register('GET', '/user/:id', userHandlers.getUserById);
register('GET', '/user', userHandlers.getUsers);
register('POST', '/user', userHandlers.register);
register('PUT', '/user', userHandlers.updateUser);
register('DELETE', '/user', userHandlers.deleteUser);

/**
 * Match an incoming request to a mock handler.
 */
export function matchMockRoute(
  method: string,
  pathname: string
): {
  handler: RouteHandler;
  params: Record<string, string>;
  description: string;
} | null {
  const normalizedMethod = method.toUpperCase();
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  for (const route of routes) {
    if (route.method !== normalizedMethod) continue;

    const match = normalizedPath.match(route.pattern);
    if (match) {
      const params: Record<string, string> = {};
      route.paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
      });

      return {
        handler: route.handler,
        params,
        description: route.description,
      };
    }
  }

  return null;
}
