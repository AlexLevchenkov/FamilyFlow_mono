import type { Request, Response } from 'express';
import {
  GetUserListsInput,
  CreateListInput,
  UpdateListInput,
  ShareListInput,
  GetListInput,
  DeleteListInput,
} from '@/middleware';
import apiResponse from '@utils/response';
import listService from '@services/list.service';

class ListController {
  async getUserLists(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { page }: GetUserListsInput = req.validated;

      const data = await listService.getUserLists({ userId: user.id, page });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async getListById(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { id }: GetListInput = req.validated;

      const data = await listService.getListById({ id, userId: user.id });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async createList(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const {
        title,
        type,
        color = '',
        icon = '',
      }: CreateListInput = req.validated;

      const data = await listService.createList({
        userId: user.id,
        title,
        type,
        color,
        icon,
      });

      apiResponse(res, data, 201);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async updateList(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const {
        id,
        title,
        type,
        color = '',
        icon = '',
      }: UpdateListInput = req.validated;

      const data = await listService.updateList({
        userId: user.id,
        id,
        title,
        type,
        color,
        icon,
      });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async deleteList(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { id }: DeleteListInput = req.validated;

      await listService.deleteList({ userId: user.id, id });
      apiResponse(res, undefined, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async shareList(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { listId, recipientId, accessTypes }: ShareListInput =
        req.validated;

      const data = await listService.shareList({
        listId,
        userId: user.id,
        recipientId,
        accessTypes,
      });

      apiResponse(res, data, 201);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async removeSharingList(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const listId = Number(req.query.listId);
      const ownerId = Number(req.query.ownerId);
      const recipientId = Number(req.query.recipientId);

      if (user.id != ownerId && user.id != recipientId) {
        apiResponse(res, null, 400, "You can't remove this sharing");
        return;
      }

      await listService.removeSharingList({
        listId,
        recipientId,
        userId: ownerId,
      });
      apiResponse(res, undefined, 201);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }
}

export default new ListController();
