export interface MockRequestContext<T = unknown> {
  url: string;
  method: string;
  params: Record<string, string>;
  query: Record<string, string | undefined>;
  body: T | null | undefined;
}

export interface MockResponseResult {
  status: number;
  data: {
    success: boolean;
    data: unknown;
    error?: string;
  };
}

export function ok<T>(data: T, status = 200): MockResponseResult {
  return {
    status,
    data: {
      success: true,
      data,
    },
  };
}

export function err(errorMessage: string, status = 400): MockResponseResult {
  return {
    status,
    data: {
      success: false,
      data: null,
      error: errorMessage,
    },
  };
}
