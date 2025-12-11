import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import z from 'zod';
import keyRotationService from '@services/keyRotationService';
import { AppError, unauthorizedError } from '@utils/errors';
import { RequestTU } from './cookieExtractor';
import { makeValidator } from '@utils/validation';

export default function authenticate(req: RequestTU, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next(unauthorizedError('No token provided'));
      return;
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      next(unauthorizedError('Invalid token format'));
      return;
    }

    const currentKeys = keyRotationService.getCurrentKeys();
    const previousKeys = keyRotationService.getPreviousKeys();

    let payload: any;
    try {
      payload = jwt.verify(token, currentKeys.access);
    } catch {
      try {
        if (!previousKeys.previousAccess) {
          next(unauthorizedError('Invalid token'));
          return;
        }
        payload = jwt.verify(token, previousKeys.previousAccess);
      } catch {
        next(unauthorizedError('Invalid token'));
      }
    }

    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(new AppError('Authentication middleware error', 500));
  }
}

const changePasswordSchema = z.object({
  userId: z.number().optional(),
  oldPassword: z.string(),
  newPassword: z.string(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  deviceId: z.string().optional(),
  ipAddress: z.string().optional(),
});

const logoutSchema = z.object({
  userId: z.number(),
  deviceId: z.string().optional(),
})

const refreshTokenSchema = z.object({
  userId: z.number(),
  refreshToken: z.string(),
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

export const validateLogin = makeValidator(loginSchema);
export const validateLogout = makeValidator(logoutSchema);
export const validateChangePassword = makeValidator(changePasswordSchema);