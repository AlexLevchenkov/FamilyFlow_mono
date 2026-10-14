import { mockDb } from '../mockDb';
import { ok, err } from './types';
import type { MockRequestContext, MockResponseResult } from './types';
import type { LoginResponse, RefreshTokenResponse } from '@api/contracts';

export const authHandlers = {
  login(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body || {}) as Record<string, unknown>;
    const email = String(body.email || '').trim();
    const password = String(body.password || '').trim();

    if (!email || !password) {
      return err('Email and password are required', 400);
    }

    const user = mockDb.getUserByEmail(email) || mockDb.getUserById(1);

    const response: LoginResponse = {
      accessToken: `mock-jwt-token-${user?.id || 1}-${Date.now()}`,
      user: {
        name: user?.name || 'Олексій Коваль',
        avatar: user?.avatar || null,
      },
    };

    return ok(response, 200);
  },

  logout(): MockResponseResult {
    return ok(null, 200);
  },

  refreshToken(): MockResponseResult {
    const response: RefreshTokenResponse = {
      accessToken: `mock-refreshed-token-${Date.now()}`,
    };
    return ok(response, 200);
  },

  forgotPassword(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body || {}) as Record<string, unknown>;
    const email = String(body.email || '').trim();
    if (!email) {
      return err('Email is required', 400);
    }
    return ok(null, 200);
  },

  resetPassword(ctx: MockRequestContext): MockResponseResult {
    const body = (ctx.body || {}) as Record<string, unknown>;
    const token = String(body.token || '').trim();
    const newPassword = String(body.newPassword || '').trim();
    if (!token || !newPassword) {
      return err('Token and new password are required', 400);
    }
    return ok(null, 200);
  },

  verifyEmail(ctx: MockRequestContext): MockResponseResult {
    const token = ctx.query.token;
    if (!token) {
      return err('Verification token is missing', 400);
    }
    return ok(null, 200);
  },
};
