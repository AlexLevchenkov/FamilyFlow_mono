import { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { isMockEnabled } from './mockConfig';
import { matchMockRoute } from './mockRouter';
import type { MockRequestContext } from './handlers/types';

const SIMULATED_LATENCY_MS = 180;

/**
 * Extracts pathname and query params from an Axios request config.
 */
function parseUrlAndQuery(config: InternalAxiosRequestConfig): {
  pathname: string;
  query: Record<string, string | undefined>;
} {
  let rawUrl = config.url || '';

  // If baseURL is included in URL or configured
  if (config.baseURL && rawUrl.startsWith(config.baseURL)) {
    rawUrl = rawUrl.substring(config.baseURL.length);
  } else if (/^https?:\/\/[^/]+/i.test(rawUrl)) {
    rawUrl = rawUrl.replace(/^https?:\/\/[^/]+/i, '');
  }

  const [pathPart, queryPart] = rawUrl.split('?');
  const pathname = pathPart || '/';

  const query: Record<string, string | undefined> = {};

  // 1. From URL query string
  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    searchParams.forEach((val, key) => {
      query[key] = val;
    });
  }

  // 2. From config.params
  if (config.params && typeof config.params === 'object') {
    Object.entries(config.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        query[key] = String(val);
      }
    });
  }

  return { pathname, query };
}

/**
 * Parses request body data.
 */
function parseBody(data: unknown): Record<string, unknown> {
  if (!data) return {};
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return (data as Record<string, unknown>) || {};
}

/**
 * Installs mock request interception on the given Axios instance.
 */
export function setupMockAdapter(api: AxiosInstance): void {
  api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    if (!isMockEnabled()) {
      return config;
    }

    const { pathname, query } = parseUrlAndQuery(config);
    const method = (config.method || 'GET').toUpperCase();

    const matched = matchMockRoute(method, pathname);
    if (!matched) {
      return config;
    }

    // Replace the network adapter with our mock handler
    config.adapter = async (cfg: InternalAxiosRequestConfig) => {
      // Realistic simulated network delay
      await new Promise(resolve => setTimeout(resolve, SIMULATED_LATENCY_MS));

      const context: MockRequestContext = {
        url: pathname,
        method,
        params: matched.params,
        query,
        body: parseBody(cfg.data),
      };

      const result = await matched.handler(context);

      const statusColor =
        result.status >= 400 ? 'color: #ec6f91;' : 'color: #35b69f;';
      console.info(
        `%c[Mock API]%c ${method} ${pathname}%c (${result.status} ${result.status < 400 ? 'OK' : 'Error'})`,
        'background: #6b48cc; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
        'color: inherit; font-weight: bold; margin-left: 6px;',
        `${statusColor} font-weight: bold;`
      );

      if (result.status >= 400) {
        const error = new AxiosError(
          result.data.error || 'Mock request failed',
          result.status === 404 ? 'ERR_NOT_FOUND' : 'ERR_BAD_REQUEST',
          cfg,
          {},
          {
            data: result.data,
            status: result.status,
            statusText: result.status === 404 ? 'Not Found' : 'Bad Request',
            headers: cfg.headers,
            config: cfg,
            request: {},
          }
        );
        return Promise.reject(error);
      }

      return {
        data: result.data,
        status: result.status,
        statusText: 'OK',
        headers: cfg.headers,
        config: cfg,
        request: {},
      };
    };

    return config;
  });
}
