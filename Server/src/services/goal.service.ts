import { Prisma } from "@prisma/client";
import prisma from "@config/prisma";
import { alreadyExistError, notFoundError } from "@utils";
import {
  CreateGoalBody,
  ById,
  GetGoalsParams,
  UpdateGoalBody,
  WithId,
  WithUserId,
  PaginatedGoalsResponse,
  GoalModel,
} from "@familyflow/contracts";

class GoalServices {
  async getUserGoals({
    userId,
    page,
  }: WithUserId<GetGoalsParams>): Promise<PaginatedGoalsResponse> {
    const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
    const currentPage = Number(page) || 1;

    const where: Prisma.GoalWhereInput = {
      OR: [
        { createdById: userId },
        {
          family: {
            FamilyMember: {
              some: {
                userId,
              },
            },
          },
        },
      ],
    };

    const goals = await prisma.goal.findMany({
      where,
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: [{ dueDate: "asc" }],
    });

    const total = await prisma.goal.count({ where });

    return {
      data: goals,
      pagination: {
        total,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(total / itemsPerPage),
      },
    };
  }

  async getGoalById({ id }: ById): Promise<GoalModel> {
    const goal = await prisma.goal.findFirst({ where: { id } });

    if (!goal) {
      throw notFoundError("Goal not found");
    }

    return goal;
  }

  async createGoal({
    userId,
    title,
    type,
    status,
    currentValue,
    targetValue,
    startsAt,
    dueDate,
    description,
    unit,
    currency,
  }: WithUserId<CreateGoalBody>): Promise<GoalModel> {
    const haveGoal = await prisma.goal.findFirst({
      where: { createdById: userId, title, type },
    });

    if (haveGoal) {
      throw alreadyExistError("Goal already exists");
    }

    const family = await prisma.familyMember.findFirst({
      where: { userId },
    });

    const newGoal = await prisma.goal.create({
      data: {
        createdById: userId,
        familyId: family?.familyId || -1,
        title,
        type,
        status,
        currentValue,
        targetValue,
        startsAt,
        dueDate,
        description,
        unit,
        currency,
      },
    });

    return newGoal;
  }

  async updateGoal({
    userId,
    id,
    title,
    status,
    currentValue,
    targetValue,
    dueDate,
    description,
    unit,
    currency,
  }: WithUserId<WithId<UpdateGoalBody>>): Promise<GoalModel> {
    const haveGoal = await prisma.goal.findFirst({
      where: { id },
    });

    if (!haveGoal) {
      throw notFoundError("Goal not found");
    }

    const goalWithThisTitle = await prisma.goal.findFirst({
      where: { createdById: userId, title },
    });

    if (!!goalWithThisTitle) {
      throw alreadyExistError("Goal with this title already exist");
    }

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        title,
        status,
        currentValue,
        targetValue,
        dueDate,
        description,
        unit,
        currency,
      },
    });

    return updatedGoal;
  }

  async deleteGoal({ id }: ById): Promise<void> {
    const haveGoal = await prisma.goal.findFirst({
      where: { id },
    });

    if (!haveGoal) {
      throw notFoundError("Goal not found");
    }

    await prisma.goal.delete({ where: { id } });
  }
}

export default new GoalServices();
