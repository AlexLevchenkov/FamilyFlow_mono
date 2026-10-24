import type { Request, Response } from "express";
import apiResponse from "@utils/response";
import goalService from "@services/goal.service";
import {
  CreateGoalRequest,
  DeleteById,
  GetById,
  GetGoalsParams,
  UpdateGoalRequest,
} from "@familyflow/contracts";

class GoalController {
  async getUserGoals(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { page }: GetGoalsParams = req.validated;

      const data = await goalService.getUserGoals({ userId: user.id, page });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async getGoalById(req: Request, res: Response): Promise<void> {
    try {
      const { id }: GetById = req.validated;

      const data = await goalService.getGoalById({ id });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async createGoal(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const {
        title,
        type,
        status,
        currentValue,
        targetValue,
        startsAt,
        dueDate,
        description,
        unit,
        currency,
      }: CreateGoalRequest = req.validated;

      const data = await goalService.createGoal({
        userId: user.id,
        title,
        type,
        status,
        currentValue,
        targetValue,
        startsAt,
        dueDate,
        description,
        unit,
        currency,
      });

      apiResponse(res, data, 201);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async updateGoal(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const {
        id,
        title,
        status,
        currentValue,
        targetValue,
        dueDate,
        description,
        unit,
        currency,
      }: UpdateGoalRequest = req.validated;

      const data = await goalService.updateGoal({
        userId: user.id,
        id,
        title,
        status,
        currentValue,
        targetValue,
        dueDate,
        description,
        unit,
        currency,
      });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async deleteGoal(req: Request, res: Response): Promise<void> {
    try {
      const { id }: DeleteById = req.validated;

      await goalService.deleteGoal({ id });
      apiResponse(res, undefined, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }
}

export default new GoalController();
