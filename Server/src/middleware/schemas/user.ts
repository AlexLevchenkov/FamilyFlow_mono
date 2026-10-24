import z from "zod";
import { makeValidator } from "@utils/validation";
import { passwordSchema } from "./auth";

const getUsersSchema = z.object({
  page: z.string().optional(),
  partName: z.string().optional(),
  partEmail: z.string().optional(),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  name: z.string().min(3).max(30),
});

const updateUserSchema = z.object({
  userId: z.coerce.number().optional(),
  email: z.string().email().optional(),
  name: z.coerce.string().optional(),
  avatar: z.coerce.string().optional(),
});

const getUserByIdSchema = z.object({
  id: z.coerce.number().int().min(1),
});

const deleteUserSchema = z.object({});

export const validateGetUsers = makeValidator(getUsersSchema, {
  query: true,
});
export const validateRegister = makeValidator(registerSchema, {
  body: true,
});
export const validateUpdateUser = makeValidator(updateUserSchema, {
  body: true,
});
export const validateGetUser = makeValidator(getUserByIdSchema, {
  params: true,
});
export const validateDeleteUser = makeValidator(deleteUserSchema, {});
