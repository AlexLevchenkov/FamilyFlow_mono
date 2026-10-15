import prisma from '@config/prisma';
import type { Family, FamilyMember, User } from '@prisma/client';
import type { AddFamilyMemberInput } from '@/middleware';
import { alreadyExistError, badRequestError, notFoundError } from '@/utils';

type FamilyWithUsers = Family & {
  owner: User;
  members: (FamilyMember & { user: User })[];
};

function toFamilyResponse(family: FamilyWithUsers) {
  return {
    id: family.id,
    ownerId: family.ownerId,
    name: family.name,
    createdAt: family.createdAt,
    updatedAt: family.updatedAt,
    members: [
      {
        id: family.ownerId,
        userId: family.owner.id,
        email: family.owner.email,
        name: family.owner.name,
        avatar: family.owner.avatar,
        isOwner: true,
        joinedAt: family.createdAt,
      },
      ...family.members.map(({ id, user, createdAt }) => ({
        id,
        userId: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isOwner: false,
        joinedAt: createdAt,
      })),
    ],
  };
}

class FamilyService {
  private async findForUser(userId: number): Promise<FamilyWithUsers | null> {
    return prisma.family.findFirst({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      include: {
        owner: true,
        members: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async getOrCreateForUser(userId: number) {
    const family = await this.findForUser(userId);
    if (family) return family;

    return prisma.family.upsert({
      where: { ownerId: userId },
      create: { ownerId: userId },
      update: {},
      include: {
        owner: true,
        members: { include: { user: true }, orderBy: { createdAt: 'asc' } },
      },
    });
  }

  async getFamily(userId: number) {
    return toFamilyResponse(await this.getOrCreateForUser(userId));
  }

  async addMember(userId: number, { email }: AddFamilyMemberInput) {
    const family = await this.getOrCreateForUser(userId);
    const user = await prisma.user.findFirst({
      where: { email: { equals: email.trim(), mode: 'insensitive' } },
    });
    if (!user) {
      throw notFoundError('No registered account exists for this email');
    }
    if (user.id === family.ownerId) {
      throw badRequestError('You are already the owner of this family');
    }

    const existingFamily = await prisma.family.findFirst({
      where: {
        OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
      },
      select: { id: true },
    });
    if (existingFamily) {
      throw alreadyExistError(
        existingFamily.id === family.id
          ? 'This user is already a member of this family'
          : 'This user already belongs to another family'
      );
    }

    const member = await prisma.familyMember.create({
      data: { familyId: family.id, userId: user.id },
      include: { user: true },
    });

    return {
      id: member.id,
      userId: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      isOwner: false,
      joinedAt: member.createdAt,
    };
  }
}

export default new FamilyService();
