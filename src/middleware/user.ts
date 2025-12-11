import z from 'zod';
import { makeValidator } from '@utils/validation';

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

const updateUserSchema = z.object({
  userId: z.number().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  avatar: z.string().optional(),
})

const getUserByIdSchema = z.object({
  userId: z.number(),
})

const deleteUserSchema = z.object({
  userId: z.number(),
})

export type GetUsersInput = z.infer<typeof getUsersSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

export const validateGetUsers = makeValidator(getUsersSchema);
export const validateRegister = makeValidator(registerSchema);
export const validateUpdateUser = makeValidator(updateUserSchema);
export const validateGetUser = makeValidator(getUserByIdSchema);
export const validateDeleteUser = makeValidator(deleteUserSchema);