import { Router } from "express";
import eventController from "@controllers/event.controller";
import {
  validateGetEvent,
  validateGetUserEvents,
  validateCreateEvent,
  validateUpdateEvent,
  validateDeleteEvent,
} from "@middleware";

const eventRouter = Router();

eventRouter.get("/:id", validateGetEvent, eventController.getEventById);
eventRouter.get("/", validateGetUserEvents, eventController.getUserEvents);
eventRouter.post("/", validateCreateEvent, eventController.createEvent);
eventRouter.put("/:id", validateUpdateEvent, eventController.updateEvent);
eventRouter.delete("/:id", validateDeleteEvent, eventController.deleteEvent);

export default eventRouter;
