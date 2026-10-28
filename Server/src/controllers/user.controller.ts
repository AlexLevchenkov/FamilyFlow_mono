import { Request, Response } from "express";
import userService from "@services/user.service";
import apiResponse from "@utils/response";
import {
  ById,
  GetUsersParams,
  PaginatedUsersResponse,
  RegisterUserBody,
  UpdateUserBody,
  UserDetail,
  UserPublic,
} from "@familyflow/contracts";

class UserController {
  async me(req: Request, res: Response) {
    try {
      const { user } = req;

      const data: UserDetail = await userService.getUserById({
        id: user.id,
      });
      apiResponse(res, { name: data.name, avatar: data.avatar }, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const { page, partEmail, partName } = req.validated
        ?.params as GetUsersParams;

      const data: PaginatedUsersResponse = await userService.getUsers({
        page,
        partEmail,
        partName,
      });

      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.validated?.body as RegisterUserBody;

      const user: UserPublic = await userService.register({
        email,
        password,
        name,
      });
      apiResponse(res, user, 201);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.validated?.params as ById;

      const data: UserDetail = await userService.getUserById({
        id,
      });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { user } = req;
      const { email, name, avatar } = req.validated?.body as UpdateUserBody;

      const data: UserDetail = await userService.updateUser({
        userId: user.id,
        name,
        avatar,
        email,
      });

      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { user } = req;
      await userService.deleteUser({ id: user.id });
      apiResponse(res, undefined, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }
}

export default new UserController();
