export interface IAuthStorage {
  getAccessToken(): Promise<string | null> | string | null;
  setAccessToken(token: string): Promise<void> | void;
  removeAccessToken(): Promise<void> | void;
}
