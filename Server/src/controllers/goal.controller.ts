import type { Request, Response } from 'express';
import type {
  CreateGoalInput,
  GoalIdInput,
  UpdateGoalInput,
} from '@/middleware';
import apiResponse from '@utils/response';
import goalService from '@services/goal.service';

function reportError(res: Response, error: unknown) {
  const message = error instanceof Error ? error.message : 'An error occurred';
  const statusCode =
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof error.statusCode === 'number'
      ? error.statusCode
      : 500;
  apiResponse(res, null, statusCode, message);
}

class GoalController {
  async getGoals(req: Request, res: Response): Promise<void> {
    try {
      apiResponse(res, await goalService.getGoals(req.user.id), 200);
    } catch (error) {
      reportError(res, error);
    }
  }

  async createGoal(req: Request, res: Response): Promise<void> {
    try {
      apiResponse(
        res,
        await goalService.createGoal(
          req.user.id,
          req.validated as CreateGoalInput
        ),
        201
      );
    } catch (error) {
      reportError(res, error);
    }
  }

  async updateGoal(req: Request, res: Response): Promise<void> {
    try {
      apiResponse(
        res,
        await goalService.updateGoal(
          req.user.id,
          req.validated as UpdateGoalInput
        ),
        200
      );
    } catch (error) {
      reportError(res, error);
    }
  }

  async deleteGoal(req: Request, res: Response): Promise<void> {
    try {
      await goalService.deleteGoal(req.user.id, req.validated as GoalIdInput);
      apiResponse(res, undefined, 200);
    } catch (error) {
      reportError(res, error);
    }
  }
}

export default new GoalController();
