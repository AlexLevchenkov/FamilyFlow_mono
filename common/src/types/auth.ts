export interface AuthStorage {
  mode: TMode;
  getAccessToken(): Promise<string | null> | string | null;
  setAccessToken(token: string): Promise<void> | void;
  removeAccessToken(): Promise<void> | void;
}

export type TMode = "WEB" | "MOBILE"