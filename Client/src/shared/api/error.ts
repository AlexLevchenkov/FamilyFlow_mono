import axios from 'axios';
import type { ApiResponse } from './contracts';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiResponse>(error)) {
    const message = error.response?.data?.error;
    if (typeof message === 'string' && message.length > 0) return message;
  }
  return error instanceof Error ? error.message : fallback;
}
