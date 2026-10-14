import { makeValidator } from "@utils/validation";
import z from "zod";

const createGoalSchema = z.object({
  title: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(60),
  progress: z.coerce.number().int().min(0).max(100).default(0),
  detail: z.string().trim().max(240).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#7656d0"),
});

const goalIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const updateGoalSchema = z
  .object({
    id: z.coerce.number().int().positive(),
    title: z.string().trim().min(1).max(120).optional(),
    category: z.string().trim().min(1).max(60).optional(),
    progress: z.coerce.number().int().min(0).max(100).optional(),
    detail: z.string().trim().max(240).nullable().optional(),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  })
  .refine(
    ({ id, ...fields }) => Object.keys(fields).length > 0,
    "At least one field is required"
  );

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type GoalIdInput = z.infer<typeof goalIdSchema>;

export const validateCreateGoal = makeValidator(createGoalSchema, {
  body: true,
});
export const validateGoalId = makeValidator(goalIdSchema, {
  params: true,
});
export const validateUpdateGoal = makeValidator(updateGoalSchema, {
  params: true,
  body: true,
});
