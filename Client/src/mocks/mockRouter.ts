import { authHandlers } from './handlers/auth.handlers';
import { userHandlers } from './handlers/user.handlers';
import { listHandlers } from './handlers/list.handlers';
import { listItemHandlers } from './handlers/listItem.handlers';
import type { MockRequestContext, MockResponseResult } from './handlers/types';

type RouteHandler = (ctx: MockRequestContext) => MockResponseResult | Promise<MockResponseResult>;

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

// 2. User routes
register('GET', '/user', userHandlers.getUsers);
register('POST', '/user', userHandlers.register);
register('PUT', '/user', userHandlers.updateUser);
register('DELETE', '/user', userHandlers.deleteUser);
register('GET', '/user/:id', userHandlers.getUserById);

// 3. List routes (specific paths like /list/share must be registered before /list/:id)
register('POST', '/list/share', listHandlers.shareList);
register('DELETE', '/list/share', listHandlers.removeSharingList);
register('GET', '/list', listHandlers.getUserLists);
register('POST', '/list', listHandlers.createList);
register('GET', '/list/:id', listHandlers.getListById);
register('PUT', '/list/:id', listHandlers.updateList);
register('DELETE', '/list/:id', listHandlers.deleteList);

// 4. ListItem routes
register('GET', '/listItem', listItemHandlers.getListItems);
register('POST', '/listItem', listItemHandlers.createListItem);
register('GET', '/listItem/:id', listItemHandlers.getListItemById);
register('PUT', '/listItem/:id', listItemHandlers.updateListItem);
register('DELETE', '/listItem/:id', listItemHandlers.deleteListItem);

/**
 * Match an incoming request to a mock handler.
 */
export function matchMockRoute(
  method: string,
  pathname: string
): { handler: RouteHandler; params: Record<string, string>; description: string } | null {
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
