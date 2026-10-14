import prisma from "@config/prisma";
import type {
  CreateGoalInput,
  GoalIdInput,
  UpdateGoalInput,
} from "@/middleware";
import { notFoundError } from "@/utils";
import familyService from "./family.service";

class GoalService {
  async getGoals(userId: number) {
    const family = await familyService.getOrCreateForUser(userId);
    return prisma.goal.findMany({
      where: { familyId: family.id },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
  }

  async createGoal(userId: number, input: CreateGoalInput) {
    const family = await familyService.getOrCreateForUser(userId);
    return prisma.goal.create({
      data: {
        familyId: family.id,
        title: input.title,
        category: input.category,
        progress: input.progress,
        detail: input.detail,
        color: input.color,
      },
    });
  }

  async updateGoal(userId: number, { id, ...input }: UpdateGoalInput) {
    const family = await familyService.getOrCreateForUser(userId);
    const goal = await prisma.goal.findFirst({
      where: { id, familyId: family.id },
      select: { id: true },
    });
    if (!goal) throw notFoundError("Goal not found");
    return prisma.goal.update({ where: { id }, data: input });
  }

  async deleteGoal(userId: number, { id }: GoalIdInput) {
    const family = await familyService.getOrCreateForUser(userId);
    const result = await prisma.goal.deleteMany({
      where: { id, familyId: family.id },
    });
    if (result.count === 0) throw notFoundError("Goal not found");
  }
}

export default new GoalService();
