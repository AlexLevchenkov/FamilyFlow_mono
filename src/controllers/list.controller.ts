import { Response } from "express";
import { RequestTU } from "@middleware/cookieExtractor";
import { GetUserListsInput, CreateListInput, UpdateListInput, ShareListInput } from "@middleware/list";
import apiResponse from "@utils/response";
import listService from "@services/list.service";

class ListController {
  async getUserLists(req: RequestTU, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { page }: GetUserListsInput = req.query;

      if (!user || !user.id) {
        apiResponse(res, null, 400, "Could not get user");
        return;
      }

      const data = await listService.getUserLists({ userId: user.id, page });

      if (!data) {
        apiResponse(res, null, 401, "Invalid credentials");
        return;
      }

      apiResponse(res, data, 200);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  }

  async getListById(req: RequestTU, res: Response): Promise<void> {
    try {
      const { user } = req;
      const id: number = Number(req.params.id);

      if (!user || !user.id || !id) {
        apiResponse(res, null, 400, "Could not get user or list Id");
        return;
      }

      const data = await listService.getListById({ userId: user.id, id });

      if (!data) {
        apiResponse(res, null, 401, "Invalid credentials");
        return;
      }

      apiResponse(res, data, 200);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  }

  async createList(req: RequestTU, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { title, type, color, icon }: CreateListInput = req.body;

      if (!user || !user.id || !title || !type) {
        apiResponse(res, null, 400, "Could not get user or title or type");
        return;
      }

      const data = await listService.createList({ userId: user.id, title, type, color, icon });

      if (data === null) {
        apiResponse(res, null, 402, "List already exists");
        return;
      }

      if (!data) {
        apiResponse(res, null, 401, "Invalid credentials");
        return;
      }

      apiResponse(res, data, 200);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  }

  async updateList(req: RequestTU, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { title, type, color, icon }: Omit<UpdateListInput, "id"> = req.body;
      const id = Number(req.params.id);

      if (!user || !user.id || !id || !title || !type) {
        apiResponse(res, null, 400, "Could not get user or title or type");
        return;
      }

      const data = await listService.updateList({ userId: user.id, id, title, type, color, icon });

      if (!data) {
        apiResponse(res, null, 401, "Invalid credentials");
        return;
      }

      apiResponse(res, data, 200);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  }

  async deleteList(req: RequestTU, res: Response): Promise<void> {
    try {
      const { user } = req;
      const id = Number(req.params.id);

      if (!user || !user.id || !id) {
        apiResponse(res, null, 400, "Could not get user or list Id");
        return;
      }

      const data = await listService.deleteList({ userId: user.id, id });

      if (!data) {
        apiResponse(res, null, 401, "Invalid credentials");
        return;
      }

      apiResponse(res, undefined, 200);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  }

  async shareList(req: RequestTU, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { listId, recipientId }: Omit<ShareListInput, 'ownerId'> = req.body;

      if (!user || !user.id || !listId || !recipientId) {
        apiResponse(res, null, 400, "Could not get user, listId or recipientId");
        return;
      }

      const data = await listService.shareList({ listId, userId: user.id, recipientId });

      if (!data) {
        apiResponse(res, null, 401, "Invalid credentials");
        return;
      }

      apiResponse(res, data, 201);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  }

  async removeSharingList(req: RequestTU, res: Response): Promise<void> {
    try {
      const listId = req.query.listId;
      const ownerId = req.query.ownerId;
      const recipientId = req.query.recipientId;

      if (!listId || !ownerId || !recipientId) {
        apiResponse(res, null, 400, "Could not get user, listId, ownerId or recipientId");
        return;
      }

      const data = await listService.removeSharingList({
        listId: Number(listId),
        userId: Number(ownerId),
        recipientId: Number(recipientId)
      });

      if (!data) {
        apiResponse(res, null, 401, "Invalid credentials");
        return;
      }

      apiResponse(res, undefined, 201);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  }
}

export default new ListController()