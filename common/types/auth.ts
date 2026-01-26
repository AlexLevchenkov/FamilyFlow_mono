export interface AuthStorage {
  getAccessToken(): Promise<string | null> | string | null;
  setAccessToken(token: string): Promise<void> | void;
  clear(): Promise<void> | void;
}
