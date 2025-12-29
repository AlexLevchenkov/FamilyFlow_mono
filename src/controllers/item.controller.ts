import { Response } from "express";
import { RequestTU } from "@middleware/cookieExtractor";
import { CreateItemInput, GetListItemsInput, UpdateItemInput } from "@middleware/schemas/item";
import itemService from "@services/item.service";
import apiResponse from "@utils/response";

class ItemController {
  async getListItems(req: RequestTU, res: Response): Promise<void> {
    try {
      const query = req.query;

      const listId: GetListItemsInput["listId"] = Number(query.listId);
      const page: GetListItemsInput["page"] = query.page
        ? Number(query.page)
        : 1;

      const data = await itemService.getListItems({ listId, page });

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

  async getListItemById(req: RequestTU, res: Response): Promise<void> {
    try {
      const id: number = Number(req.params.id);

      const data = await itemService.getListItemById({ id });

      if (!data) {
        apiResponse(res, null, 401, "Invalid credentials");
        return;
      }

      apiResponse(res, data, 200);
    }  catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  }

  async createListItem(req: RequestTU, res: Response): Promise<void> {
    try {
      const {
        listId,
        title,
        completed = false,
        priority = 0,
        position = 0,
        description = "",
        dueDate,
      }: CreateItemInput = req.body;

      if (!listId || !title) {
        apiResponse(res, null, 400, "Could not get listId or title");
        return;
      }

      const data = await itemService.createListItem({
        listId,
        title,
        completed,
        priority,
        position,
        description,
        dueDate,
      });

      if (!data) {
        apiResponse(res, null, 401, "Invalid credentials");
        return;
      }

      apiResponse(res, data, 200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  }

  async updateListItem(req: RequestTU, res: Response): Promise<void> {
    try {
      const {
        listId,
        title,
        completed,
        priority,
        position,
        description,
        dueDate,
      }: UpdateItemInput = req.body;
      const id = Number(req.params.id);

      if (!listId) {
        apiResponse(res, null, 400, "Could not get listId");
        return;
      }

      const data = await itemService.updateListItem({
        id,
        listId,
        title,
        completed,
        priority,
        position,
        description,
        dueDate,
      });

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

  async deleteListItem(req: RequestTU, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (!id) {
        apiResponse(res, null, 400, "Could not get list item Id");
        return;
      }

      const data = await itemService.deleteListItem({ id });

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
}

export default new ItemController();
