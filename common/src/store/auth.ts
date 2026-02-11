import { AuthStorage } from '@familyflow/common/types/auth';

export let authStorage: AuthStorage;

export function initAuthStorage(storage: AuthStorage) {
  authStorage = storage;
}
