import { TMode } from "@familyflow/common/types/auth";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  mode?: TMode;
}

export async function apiRequest<T>(
  url: string,
  options: RequestOptions
): Promise<T> {
  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token && {
        "Authorization": `Bearer ${options.token}`,
      }),
      ...(options.mode && { 
        "X-Auth-Mode": options.mode
      }),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw {
      status: res.status,
      message: errorBody?.message ?? "API Error",
    };
  }

  return res.json().then((value) => value.data);
}
