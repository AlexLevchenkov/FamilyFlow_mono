import { Router } from "express";
import taskController from "@controllers/task.controller";
import {
  validateGetTask,
  validateGetUserTasks,
  validateCreateTask,
  validateUpdateTask,
  validateDeleteTask,
} from "@middleware";

const taskRouter = Router();

taskRouter.get("/:id", validateGetTask, taskController.getTaskById);
taskRouter.get("/", validateGetUserTasks, taskController.getUserTasks);
taskRouter.post("/", validateCreateTask, taskController.createTask);
taskRouter.put("/:id", validateUpdateTask, taskController.updateTask);
taskRouter.delete("/:id", validateDeleteTask, taskController.deleteTask);

export default taskRouter;
