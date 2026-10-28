import prisma from "@config/prisma";
import type {
  AddFamilyMemberBody,
  CreateFamilyBody,
  FamilyById,
  FamilyRole,
  FamilyWithMemberId,
  UpdateFamilyMemberRoleBody,
  UpdateFamilyBody,
  WithUserId,
} from "@familyflow/contracts";
import { Family, FamilyMember } from "@prisma/client";
import {
  alreadyExistError,
  badRequestError,
  forbiddenError,
  notFoundError,
} from "@utils";

class FamilyService {
  async getCurrentUserFamily({ userId }: WithUserId<{}>): Promise<Family> {
    const membership = await prisma.familyMember.findFirst({
      where: { userId },
      include: {
        family: {
          include: {
            FamilyMember: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                  },
                },
              },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    if (!membership || !membership.family) {
      throw notFoundError("User does not belong to any family");
    }

    return membership.family;
  }

  async getFamilyById({
    userId,
    familyId,
  }: WithUserId<FamilyById>): Promise<Family> {
    const membership = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId,
          userId,
        },
      },
    });

    if (!membership) {
      throw forbiddenError("You are not a member of this family");
    }

    const family = await prisma.family.findUnique({
      where: { id: familyId },
      include: {
        FamilyMember: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!family) {
      throw notFoundError("Family not found");
    }

    return family;
  }

  async createFamily({
    userId,
    name,
  }: WithUserId<CreateFamilyBody>): Promise<Family | null> {
    const existingMembership = await prisma.familyMember.findFirst({
      where: { userId },
    });

    if (existingMembership) {
      throw alreadyExistError(
        "You already belong to a family. Leave or delete your current family first."
      );
    }

    const newFamily = await prisma.$transaction(async tx => {
      const family = await tx.family.create({
        data: { name },
      });

      await tx.familyMember.create({
        data: {
          familyId: family.id,
          userId,
          role: "OWNER",
        },
      });

      return tx.family.findUnique({
        where: { id: family.id },
        include: {
          FamilyMember: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });
    });

    return newFamily;
  }

  async updateFamily({
    userId,
    familyId,
    name,
  }: WithUserId<UpdateFamilyBody> & FamilyById): Promise<Family> {
    const membership = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId,
          userId,
        },
      },
    });

    if (!membership) {
      throw forbiddenError("You are not a member of this family");
    }

    if (membership.role !== "OWNER" && membership.role !== "PARENT") {
      throw forbiddenError("Only OWNER or PARENT can update family details");
    }

    const updated = await prisma.family.update({
      where: { id: familyId },
      data: { name },
      include: {
        FamilyMember: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return updated;
  }

  async deleteFamily({
    userId,
    familyId,
  }: WithUserId<FamilyById>): Promise<void> {
    const membership = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId,
          userId,
        },
      },
    });

    if (!membership) {
      throw forbiddenError("You are not a member of this family");
    }

    if (membership.role !== "OWNER") {
      throw forbiddenError("Only OWNER can delete the family");
    }

    await prisma.family.delete({
      where: { id: familyId },
    });
  }

  async getMembers({
    userId,
    familyId,
  }: WithUserId<FamilyById>): Promise<FamilyMember[]> {
    const membership = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId,
          userId,
        },
      },
    });

    if (!membership) {
      throw forbiddenError("You are not a member of this family");
    }

    const members = await prisma.familyMember.findMany({
      where: { familyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    });

    return members;
  }

  async addMember({
    userId,
    familyId,
    email,
    role = "MEMBER",
  }: WithUserId<AddFamilyMemberBody> & FamilyById): Promise<FamilyMember> {
    const currentMember = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId,
          userId,
        },
      },
    });

    if (!currentMember) {
      throw forbiddenError("You are not a member of this family");
    }

    if (currentMember.role !== "OWNER" && currentMember.role !== "PARENT") {
      throw forbiddenError(
        "Only OWNER or PARENT can add members to the family"
      );
    }

    if (role === "OWNER" && currentMember.role !== "OWNER") {
      throw forbiddenError("Only OWNER can grant OWNER role");
    }

    const targetUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!targetUser) {
      throw notFoundError("User not found");
    }

    const existingInFamily = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId,
          userId: targetUser.id,
        },
      },
    });

    if (existingInFamily) {
      throw alreadyExistError("User is already a member of this family");
    }

    const userAnyFamily = await prisma.familyMember.findFirst({
      where: { userId: targetUser.id },
    });

    if (userAnyFamily) {
      throw alreadyExistError("User is already a member of another family");
    }

    const newMember = await prisma.familyMember.create({
      data: {
        familyId,
        userId: targetUser.id,
        role: role || "MEMBER",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return newMember;
  }

  async updateMemberRole({
    userId,
    familyId,
    memberId,
    role,
  }: WithUserId<
    FamilyById & UpdateFamilyMemberRoleBody & { memberId: number }
  >) {
    const currentMember = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId,
          userId,
        },
      },
    });

    if (!currentMember) {
      throw forbiddenError("You are not a member of this family");
    }

    if (currentMember.role !== "OWNER" && currentMember.role !== "PARENT") {
      throw forbiddenError("Only OWNER or PARENT can update member roles");
    }

    const targetMember = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId,
          userId: memberId,
        },
      },
    });

    if (!targetMember) {
      throw notFoundError("Member not found in this family");
    }

    if (currentMember.role !== "OWNER") {
      if (targetMember.role === "OWNER" || role === "OWNER") {
        throw forbiddenError("Only OWNER can modify or assign OWNER role");
      }
    }

    if (
      userId === memberId &&
      targetMember.role === "OWNER" &&
      role !== "OWNER"
    ) {
      const otherOwnersCount = await prisma.familyMember.count({
        where: {
          familyId,
          role: "OWNER",
          userId: { not: userId },
        },
      });

      if (otherOwnersCount === 0) {
        throw badRequestError(
          "Cannot demote the only OWNER. Transfer ownership or assign another OWNER first."
        );
      }
    }

    const updated = await prisma.familyMember.update({
      where: {
        familyId_userId: {
          familyId,
          userId: memberId,
        },
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return updated;
  }

  async removeMember({
    userId,
    familyId,
    memberId,
  }: WithUserId<FamilyWithMemberId>) {
    const currentMember = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId,
          userId,
        },
      },
    });

    if (!currentMember) {
      throw forbiddenError("You are not a member of this family");
    }

    const targetMember = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId,
          userId: memberId,
        },
      },
    });

    if (!targetMember) {
      throw notFoundError("Member not found in this family");
    }

    const isSelf = userId === memberId;

    if (!isSelf) {
      if (currentMember.role !== "OWNER" && currentMember.role !== "PARENT") {
        throw forbiddenError(
          "You do not have permission to remove members from this family"
        );
      }

      if (
        currentMember.role === "PARENT" &&
        (targetMember.role === "OWNER" || targetMember.role === "PARENT")
      ) {
        throw forbiddenError("PARENT cannot remove OWNER or another PARENT");
      }
    } else {
      if (targetMember.role === "OWNER") {
        const otherOwnersCount = await prisma.familyMember.count({
          where: {
            familyId,
            role: "OWNER",
            userId: { not: userId },
          },
        });

        if (otherOwnersCount === 0) {
          throw badRequestError(
            "The only OWNER cannot leave the family. Assign another OWNER or delete the family."
          );
        }
      }
    }

    await prisma.familyMember.delete({
      where: {
        familyId_userId: {
          familyId,
          userId: memberId,
        },
      },
    });

    return {
      message: isSelf
        ? "Left family successfully"
        : "Member removed successfully",
    };
  }
}

const familyService = new FamilyService();
export default familyService;
