import { mockDb } from '@mocks/database';
import { ok, err } from '@mocks/handlers/types';
import type {
  MockRequestContext,
  MockResponseResult,
} from '@mocks/handlers/types';
import type {
  ForgotPasswordBody,
  LoginBody,
  LoginResponse,
  RefreshTokenResponse,
  ResetPasswordBody,
} from '@types';

export const authHandlers = {
  login(ctx: MockRequestContext<LoginBody>): MockResponseResult {
    const { email, password } = ctx.body || {};

    if (!email || !password) {
      return err('Email and password are required', 400);
    }

    const user =
      mockDb.users.getUserByEmail(email) || mockDb.users.getUserById(1);

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
      refreshToken: `mock-refreshed-token-${Date.now()}`,
    };
    return ok(response, 200);
  },

  forgotPassword(
    ctx: MockRequestContext<ForgotPasswordBody>
  ): MockResponseResult {
    const { email } = ctx.body || {};
    if (!email) {
      return err('Email is required', 400);
    }
    return ok(null, 200);
  },

  resetPassword(
    ctx: MockRequestContext<ResetPasswordBody>
  ): MockResponseResult {
    const { token, newPassword } = ctx.body || {};
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
