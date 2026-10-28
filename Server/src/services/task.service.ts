import { Prisma, Visibility } from "@prisma/client";
import prisma from "@config/prisma";
import {
  CreateTaskBody,
  ById,
  GetUserTasksParams,
  PaginatedTasksResponse,
  TaskModel,
  UpdateTaskBody,
  WithUserId,
  WithId,
} from "@familyflow/contracts";
import { alreadyExistError, notFoundError } from "@utils";

class TaskServices {
  async getUserTasks({
    userId,
    page,
    limit,
  }: WithUserId<GetUserTasksParams>): Promise<PaginatedTasksResponse> {
    const itemsPerPage =
      Number(limit) || Number(process.env.ITEMS_PER_PAGE) || 10;
    const currentPage = Number(page) || 1;

    const where: Prisma.TaskWhereInput = {
      OR: [
        { userId },
        {
          visibility: Visibility.shared,
          user: {
            FamilyMember: {
              some: {
                family: {
                  FamilyMember: {
                    some: {
                      userId,
                    },
                  },
                },
              },
            },
          },
        },
      ],
    };

    const tasks = await prisma.task.findMany({
      where,
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: [{ date: "asc", title: "asc" }],
    });

    const total = await prisma.task.count({ where });

    return {
      data: tasks,
      pagination: {
        total,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(total / itemsPerPage),
      },
    };
  }

  async getTaskById({ id }: ById): Promise<TaskModel> {
    const task = await prisma.task.findFirst({ where: { id } });

    if (!task) {
      throw notFoundError("Task not found");
    }

    return task;
  }

  async createTask({
    userId,
    title,
    type,
    visibility,
    date,
  }: WithUserId<CreateTaskBody>): Promise<TaskModel> {
    const haveTask = await prisma.task.findFirst({
      where: { userId, title, type },
    });

    if (haveTask) {
      throw alreadyExistError("Task already exists");
    }

    const newTask = await prisma.task.create({
      data: { userId, title, type, visibility, date },
    });

    return newTask;
  }

  async updateTask({
    userId,
    id,
    title,
    type,
    visibility,
    status,
    date,
  }: WithUserId<WithId<UpdateTaskBody>>): Promise<TaskModel> {
    const haveTask = await prisma.task.findFirst({
      where: { userId, id },
    });

    if (!haveTask) {
      throw notFoundError("Task not found");
    }

    const taskWithThisTitle = await prisma.task.findFirst({
      where: { userId, title },
    });

    if (!!taskWithThisTitle) {
      throw alreadyExistError("Task with this title already exist");
    }

    const updatedTask = await prisma.task.update({
      where: { userId, id },
      data: { title, type, visibility, status, date },
    });

    return updatedTask;
  }

  async deleteTask({ id }: ById): Promise<void> {
    const haveTask = await prisma.task.findFirst({
      where: { id },
    });

    if (!haveTask) {
      throw notFoundError("Task not found");
    }

    await prisma.task.delete({ where: { id } });
  }
}

export default new TaskServices();
