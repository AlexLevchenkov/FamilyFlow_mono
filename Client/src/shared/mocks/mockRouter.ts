import {
  authHandlers,
  eventHandlers,
  familyHandlers,
  goalHandlers,
  taskHandlers,
  userHandlers,
} from './handlers';
import type { MockRequestContext, MockResponseResult } from './handlers';

type RouteHandler = (
  ctx: MockRequestContext<any>
) => MockResponseResult | Promise<MockResponseResult>;

interface RouteDefinition {
  method: string;
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
  description: string;
}

const routes: RouteDefinition[] = [];

function register(method: string, path: string, handler: RouteHandler) {
  const paramNames: string[] = [];
  const regexPattern = path.replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
    paramNames.push(paramName);
    return '([^/]+)';
  });

  routes.push({
    method: method.toUpperCase(),
    pattern: new RegExp(`^${regexPattern}$`),
    paramNames,
    handler,
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
register('GET', '/event', eventHandlers.getEvents);
register('POST', '/event', eventHandlers.createEvent);
register('GET', '/event/:id', eventHandlers.getEventById);
register('PUT', '/event/:id', eventHandlers.updateEvent);
register('DELETE', '/event/:id', eventHandlers.deleteEvent);

// 3. Family routes
register('GET', '/family/my', familyHandlers.getMyFamily);
register('POST', '/family', familyHandlers.createFamily);
register('GET', '/family/:id', familyHandlers.getFamilyById);
register('PUT', '/family/:id', familyHandlers.updateFamily);
register('DELETE', '/family/:id', familyHandlers.deleteFamily);
register('GET', '/family/:id/members', familyHandlers.getFamilyMembers);
register('POST', '/family/:id/members', familyHandlers.addFamilyMember);
register(
  'PUT',
  '/family/:id/members/:memberId',
  familyHandlers.updateFamilyMemberRole
);
register(
  'DELETE',
  '/family/:id/members/:memberId',
  familyHandlers.removeFamilyMember
);

// 4. Goal routes
register('GET', '/goal', goalHandlers.getGoals);
register('POST', '/goal', goalHandlers.createGoal);
register('GET', '/goal/:id', goalHandlers.getGoalById);
register('PUT', '/goal/:id', goalHandlers.updateGoal);
register('DELETE', '/goal/:id', goalHandlers.deleteGoal);

// 5. Task routes
register('GET', '/task', taskHandlers.getTasks);
register('POST', '/task', taskHandlers.createTask);
register('GET', '/task/:id', taskHandlers.getTaskById);
register('PUT', '/task/:id', taskHandlers.updateTask);
register('DELETE', '/task/:id', taskHandlers.deleteTask);

// 6. User routes
register('GET', '/user', userHandlers.getUsers);
register('POST', '/user', userHandlers.register);
register('PUT', '/user', userHandlers.updateUser);
register('DELETE', '/user', userHandlers.deleteUser);
register('GET', '/user/:id', userHandlers.getUserById);

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
