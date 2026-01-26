import { AuthStorage } from "common/types/auth";

export let authStorage: AuthStorage;

export function initAuthStorage(storage: AuthStorage) {
  authStorage = storage;
}
