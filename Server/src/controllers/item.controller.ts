import type { Request, Response } from "express";
import itemService from "@services/item.service";
import apiResponse from "@utils/response";

class ItemController {
  async getListItems(req: Request, res: Response): Promise<void> {
    try {
      const data = await itemService.getListItems({ ...req.validated });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async getListItemById(req: Request, res: Response): Promise<void> {
    try {
      const data = await itemService.getListItemById({ ...req.validated });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async createListItem(req: Request, res: Response): Promise<void> {
    try {
      const data = await itemService.createListItem({ ...req.validated });

      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async updateListItem(req: Request, res: Response): Promise<void> {
    try {
      const data = await itemService.updateListItem({ ...req.validated });

      if (!data) {
        apiResponse(res, null, 401, "Invalid credentials");
        return;
      }

      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async deleteListItem(req: Request, res: Response): Promise<void> {
    try {
      await itemService.deleteListItem({ ...req.validated });
      apiResponse(res, undefined, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }
}

export default new ItemController();
