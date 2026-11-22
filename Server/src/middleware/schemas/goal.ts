import z from "zod";
import { makeValidator } from "@utils/validation";
import { GoalType, GoalStatus } from "@familyflow/contracts";

const type = ["AMOUNT", "COUNTER", "STEPS"] as GoalType[];

const goalStatus = ["ACTIVE", "COMPLETED", "ARCHIVED"] as GoalStatus[];

const getUserGoalsSchema = z.object({
  page: z.coerce
    .number()
    .refine(page => page > 0, "Min page value is 1")
    .optional(),
});

const getGoalSchema = z.object({
  id: z.coerce.number(),
});

const createGoalSchema = z
  .object({
    title: z.coerce.string().min(1),
    description: z.coerce.string().optional(),
    type: z.enum(type),
    status: z.enum(goalStatus),
    currentValue: z.coerce.number().min(0, "Current value must be at least 0"),
    targetValue: z.coerce
      .number()
      .positive("Target value must be greater than 0"),
    unit: z.coerce.string().optional(),
    currency: z.coerce.string().optional(),
    startsAt: z.coerce.date(),
    dueDate: z.coerce.date(),
  })
  .refine(data => data.currentValue <= data.targetValue, {
    message: "Current value cannot exceed target value",
    path: ["currentValue"],
  });

const updateGoalSchema = z
  .object({
    id: z.coerce.number(),
    title: z.coerce.string().min(1),
    description: z.coerce.string().optional(),
    status: z.enum(goalStatus),
    currentValue: z.coerce.number().min(0, "Current value must be at least 0"),
    targetValue: z.coerce
      .number()
      .positive("Target value must be greater than 0"),
    unit: z.coerce.string().optional(),
    currency: z.coerce.string().optional(),
    dueDate: z.coerce.date(),
  })
  .refine(data => data.currentValue <= data.targetValue, {
    message: "Current value cannot exceed target value",
    path: ["currentValue"],
  });

const deleteGoalSchema = z.object({
  id: z.coerce.number(),
});

export const validateGetUserGoals = makeValidator(getUserGoalsSchema, {
  query: true,
});
export const validateGetGoal = makeValidator(getGoalSchema, {
  params: true,
});
export const validateCreateGoal = makeValidator(createGoalSchema, {
  body: true,
});
export const validateUpdateGoal = makeValidator(updateGoalSchema, {
  body: true,
  params: true,
});
export const validateDeleteGoal = makeValidator(deleteGoalSchema, {
  params: true,
});
