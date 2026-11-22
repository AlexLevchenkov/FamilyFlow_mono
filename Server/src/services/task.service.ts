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
    from,
    to,
  }: WithUserId<GetUserTasksParams>): Promise<PaginatedTasksResponse> {
    const itemsPerPage =
      Number(limit) || Number(process.env.ITEMS_PER_PAGE) || 10;
    const currentPage = Number(page) || 1;

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const where: Prisma.TaskWhereInput = {
      AND: [
        {
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
        },
        ...(fromDate || toDate
          ? [
              {
                date: {
                  ...(fromDate ? { gte: fromDate } : {}),
                  ...(toDate ? { lte: toDate } : {}),
                },
              },
            ]
          : []),
      ],
    };

    const tasks = await prisma.task.findMany({
      where,
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: [{ date: "asc" }, { title: "asc" }],
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
      where: {
        id,
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
      },
    });

    if (!haveTask) {
      throw notFoundError("Task not found");
    }

    if (title && title !== haveTask.title) {
      const taskWithThisTitle = await prisma.task.findFirst({
        where: { userId: haveTask.userId, title, NOT: { id } },
      });

      if (!!taskWithThisTitle) {
        throw alreadyExistError("Task with this title already exist");
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(visibility !== undefined ? { visibility } : {}),
        ...(status !== undefined ? { status: Boolean(status) } : {}),
        ...(date !== undefined ? { date } : {}),
      },
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
