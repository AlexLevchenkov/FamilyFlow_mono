import {
  CreateTaskRequest,
  DeleteById,
  GetById,
  GetUserTasksParams,
  PaginatedTasksResponse,
  UpdateTaskRequest,
} from "@familyflow/contracts";
import taskService from "@services/task.service";
import apiResponse from "@utils/response";
import asyncHandler from "@utils/asyncHandler";

class TaskController {
  getUserTasks = asyncHandler(async (req, res) => {
    const { user } = req;
    const { page, limit } = req.validated as GetUserTasksParams;

    const data: PaginatedTasksResponse = await taskService.getUserTasks({
      userId: user.id,
      page,
      limit,
    });

    apiResponse(res, data, 200);
  });

  getTaskById = asyncHandler(async (req, res) => {
    const { id } = req.validated as GetById;

    const data = await taskService.getTaskById({ id });

    apiResponse(res, data, 200);
  });

  createTask = asyncHandler(async (req, res) => {
    const { user } = req;
    const { title, type, visibility, date } =
      req.validated as CreateTaskRequest;

    const data = await taskService.createTask({
      userId: user.id,
      title,
      type,
      visibility,
      date,
    });

    apiResponse(res, data, 201);
  });

  updateTask = asyncHandler(async (req, res) => {
    const { user } = req;
    const { id, title, type, visibility, status, date } =
      req.validated as UpdateTaskRequest;

    const data = await taskService.updateTask({
      userId: user.id,
      id,
      title,
      type,
      visibility,
      status,
      date,
    });

    apiResponse(res, data, 200);
  });

  deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.validated as DeleteById;

    await taskService.deleteTask({ id });

    apiResponse(res, undefined, 204);
  });
}

export default new TaskController();
