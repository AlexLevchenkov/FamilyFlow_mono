import z from "zod";
import { makeValidator } from "@utils/validation";
import { TaskType, Visibility } from "@familyflow/contracts";

const type = [
  "home",
  "family",
  "work",
  "health",
  "finance",
  "learning",
  "personal",
  "social",
  "travel",
  "other",
] as TaskType[];

const visibility = ["shared", "personal", "secret"] as Visibility[];

const getUserTasksSchema = z.object({
  page: z.coerce
    .number()
    .refine(page => page > 0, "Min page value is 1")
    .optional(),
  limit: z.coerce
    .number()
    .refine(page => page > 0, "Min page value is 1")
    .optional(),
});

const getTaskSchema = z.object({
  id: z.coerce.number(),
});

const createTaskSchema = z.object({
  title: z.string().min(1),
  type: z.enum(type),
  visibility: z.enum(visibility),
  date: z.date(),
});

const updateTaskSchema = z.object({
  id: z.coerce.number(),
  title: z.string().min(1),
  type: z.enum(type),
  visibility: z.enum(visibility),
  status: z.boolean(),
  date: z.date(),
});

const deleteTaskSchema = z.object({
  id: z.coerce.number(),
});

export const validateGetUserTasks = makeValidator(getUserTasksSchema, {
  query: true,
});
export const validateGetTask = makeValidator(getTaskSchema, {
  params: true,
});
export const validateCreateTask = makeValidator(createTaskSchema, {
  body: true,
});
export const validateUpdateTask = makeValidator(updateTaskSchema, {
  body: true,
  params: true,
});
export const validateDeleteTask = makeValidator(deleteTaskSchema, {
  params: true,
});
