import type { Request, Response } from "express";
import apiResponse from "@utils/response";
import eventService from "@services/event.service";
import {
  CreateEventRequest,
  DeleteById,
  GetById,
  GetEventsParams,
  UpdateEventRequest,
} from "@familyflow/contracts";

class EventController {
  async getUserEvents(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { page }: GetEventsParams = req.validated;

      const data = await eventService.getUserEvents({ userId: user.id, page });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const { id }: GetById = req.validated;

      const data = await eventService.getEventById({ id });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { title, color, date, repeatability } =
        req.validated as CreateEventRequest;

      const data = await eventService.createEvent({
        userId: user.id,
        title,
        color,
        date,
        repeatability,
      });

      apiResponse(res, data, 201);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id, title, color, date, repeatability }: UpdateEventRequest =
        req.validated;

      const data = await eventService.updateEvent({
        id,
        title,
        color,
        date,
        repeatability,
      });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }

  async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id }: DeleteById = req.validated;

      await eventService.deleteEvent({ id });
      apiResponse(res, undefined, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  }
}

export default new EventController();
