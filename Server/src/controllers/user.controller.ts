import { Request, Response } from 'express';
import { GetUsersInput, RegisterInput, UpdateUserInput } from '@/middleware';
import userService from '@services/user.service';
import apiResponse from '@utils/response';

class UserController {
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { page, partName, partEmail }: GetUsersInput = req.validated;
      const data = await userService.getUsers({ page, partName, partEmail });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body as RegisterInput;
      const user = await userService.register({ email, password, name });
      apiResponse(res, user, 201);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const data = await userService.getUserById({ ...req.validated });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;

      const userId = Number(user?.id);
      const { email, name, avatar } = req.body as UpdateUserInput;

      const data = await userService.updateUser({
        userId,
        name,
        avatar,
        email,
      });

      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const userId = Number(user?.id);
      await userService.deleteUser({ userId });
      apiResponse(res, undefined, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }
}

export default new UserController();
