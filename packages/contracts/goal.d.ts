import { Prisma } from "@prisma/client";
import { PaginatedResponse } from "./base";

export type GoalType = "AMOUNT" | "COUNTER" | "STEPS";

export type GoalStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export interface GoalModel {
  id: number;
  familyId: number;
  createdById: number;
  title: string;
  description: string | null;
  type: GoalType;
  status: GoalStatus;
  currentValue: number | null;
  targetValue: number | null;
  unit: string | null;
  currency: string | null;
  startsAt: Date | null;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetGoalsParams {
  page?: number;
}

export type PaginatedGoalsResponse = PaginatedResponse<GoalModel>;

export interface CreateGoalBody {
  title: string;
  description: string | null;
  type: GoalType;
  status: GoalStatus;
  currentValue: number | null;
  targetValue: number | null;
  unit: string | null;
  currency: string | null;
  startsAt: Date | null;
  dueDate: Date | null;
}

export interface UpdateGoalBody {
  title: string;
  description: string | null;
  status: GoalStatus;
  currentValue: number | null;
  targetValue: number | null;
  unit: string | null;
  currency: string | null;
  dueDate: Date | null;
}
