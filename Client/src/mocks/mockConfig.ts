import { mockDb } from './mockDb';

const STORAGE_KEY = 'familyflow_use_mocks';

declare global {
  interface Window {
    toggleMocks?: (enable?: boolean) => boolean;
    resetMockData?: () => void;
    isMockEnabled?: () => boolean;
  }
}

/**
 * Determines whether mock mode is currently enabled.
 * Priority:
 * 1. LocalStorage setting ('familyflow_use_mocks')
 * 2. Vite environment variable (VITE_USE_MOCKS === 'true')
 */
export function isMockEnabled(): boolean {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      return saved === 'true';
    }
  }

  return import.meta.env?.VITE_USE_MOCKS === 'true';
}

/**
 * Programmatically toggle mock mode on or off.
 */
export function setMockEnabled(enabled: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, String(enabled));
    console.info(
      `%c[FamilyFlow Mock API] Mock mode is now ${enabled ? 'ENABLED' : 'DISABLED'}. Reloading...`,
      'color: #7656d0; font-weight: bold;'
    );
    window.location.reload();
  }
}

// Attach developer helpers to window
if (typeof window !== 'undefined') {
  window.toggleMocks = (enable?: boolean) => {
    const nextState = enable !== undefined ? enable : !isMockEnabled();
    setMockEnabled(nextState);
    return nextState;
  };

  window.resetMockData = () => {
    mockDb.reset();
    console.info(
      '%c[FamilyFlow Mock API] Mock database has been reset to initial state.',
      'color: #35b69f; font-weight: bold;'
    );
  };

  window.isMockEnabled = isMockEnabled;
}
