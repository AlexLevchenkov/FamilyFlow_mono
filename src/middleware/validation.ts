import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '@utils/errors';
import z from 'zod';

const getUsersSchema = z.object({
  page: z.string().optional(),
  partName: z.string().optional(),
  partEmail: z.string().optional(),
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3).max(30),
});

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

const changePasswordSchema = z.object({
  userId: z.number().optional(),
  oldPassword: z.string(),
  newPassword: z.string(),
})

const getUserByIdSchema = z.object({
  userId: z.number(),
})

const updateUserSchema = z.object({
  userId: z.number().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  avatar: z.string().optional(),
})

const deleteUserSchema = z.object({
  userId: z.number(),
})

export type GetUsersInput = z.infer<typeof getUsersSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

const makeValidator = (schema: z.ZodTypeAny, messagePrefix = 'Validation error: ') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.body || typeof req.body !== 'object') {
        next(new ValidationError('Invalid request body'));
        return;
      }

      const parseResult = schema.safeParse(req.body);
      if (!parseResult.success) {
        const msg = messagePrefix.endsWith(' ') ? messagePrefix + JSON.stringify(parseResult.error.format()) : messagePrefix + JSON.stringify(parseResult.error.format());
        next(new ValidationError(msg));
        return;
      }

      next();
    } catch (error) {
      next(new AppError('Validation middleware error', 500));
    }
  };
};

export const validateGetUsers = makeValidator(getUsersSchema);
export const validateRegister = makeValidator(registerSchema);
export const validateLogin = makeValidator(loginSchema);
export const validateLogout = makeValidator(logoutSchema);
export const validateChangePassword = makeValidator(changePasswordSchema);
export const validateUpdateUser = makeValidator(updateUserSchema);
export const validateDeleteUser = makeValidator(deleteUserSchema);