import prisma from '@config/prisma';
import { AccessTypes } from '@prisma/client';
import {
  DeleteListInput,
  GetListInput,
  GetUserListsInput,
  CreateListInput,
  UpdateListInput,
  WithUserId,
  ShareListInput,
} from '@/middleware';
import { alreadyExistError, internalServerError, notFoundError } from '@/utils';

interface enoughRightInterface {
  userId: number;
  listId: number;
  accessTypes: AccessTypes;
}

const ACCESS_LEVEL: Record<AccessTypes, number> = {
  watch: 1,
  edit: 2,
  fullAccess: 3,
};

class ListServices {
  async getUserLists({ userId, page }: WithUserId<GetUserListsInput>) {
    const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
    const where = {
      OR: [{ userId }, { sharedWith: { some: { recipientId: userId } } }],
    };

    const lists = await prisma.list.findMany({
      where,
      skip: page ? Number(page - 1) * itemsPerPage : 0,
      take: itemsPerPage,
      orderBy: [{ title: 'asc' }],
    });

    const total = await prisma.list.count({ where });

    return {
      data: lists,
      pagination: {
        total,
        page: page || 1,
        limit: itemsPerPage,
        totalPages: Math.ceil(total / itemsPerPage),
      },
    };
  }

  async getListById({ id, userId }: GetListInput & { userId: number }) {
    const list = await prisma.list.findFirst({ where: { id, userId } });

    if (!list) {
      throw notFoundError('List not found');
    }

    return list;
  }

  async createList({
    userId,
    title,
    type,
    color,
    icon,
  }: WithUserId<CreateListInput>) {
    const haveList = await prisma.list.findFirst({
      where: { userId, title, type },
    });

    if (haveList) {
      throw alreadyExistError('List already exists');
    }

    const newList = await prisma.list.create({
      data: { userId, title, type, color, icon },
    });

    return newList;
  }

  async updateList({
    userId,
    id,
    title,
    type,
    color,
    icon,
  }: WithUserId<UpdateListInput>) {
    const haveList = await prisma.list.findFirst({
      where: { userId, id },
    });

    if (!haveList) {
      throw notFoundError('List not found');
    }

    const listWithThisTitle = await prisma.list.findFirst({
      where: { userId, title },
    });

    if (!!listWithThisTitle) {
      throw alreadyExistError('List with this title already exist');
    }

    const updatedList = await prisma.list.update({
      where: { userId, id },
      data: { title, type, color, icon },
    });

    return updatedList;
  }

  async deleteList({ userId, id }: WithUserId<DeleteListInput>) {
    const haveList = await prisma.list.findFirst({
      where: { userId, id },
    });

    if (!haveList) {
      throw notFoundError('List not found');
    }

    const result = await prisma.list.delete({ where: { userId, id } });

    if (!result) {
      throw internalServerError('Failed to delete list');
    }
  }

  async shareList({
    listId,
    userId,
    recipientId,
    accessTypes,
  }: WithUserId<ShareListInput>) {
    const list = await prisma.list.findFirst({ where: { id: listId } });

    if (!list) {
      throw notFoundError('List not found');
    }

    if (list.userId !== userId) {
      throw notFoundError('List not found');
    }

    const sharedWith = await prisma.sharedLists.create({
      data: { listId, ownerId: userId, recipientId, accessTypes },
    });

    if (!sharedWith) {
      throw internalServerError('Failed to create share list');
    }

    return sharedWith;
  }

  async removeSharingList({
    listId,
    userId,
    recipientId,
  }: WithUserId<Omit<ShareListInput, 'accessTypes'>>) {
    const sharedWith = await prisma.sharedLists.findFirst({
      where: { listId, ownerId: userId, recipientId },
    });

    if (!sharedWith) {
      throw notFoundError('Failed to find share connect');
    }

    const result = await prisma.sharedLists.delete({
      where: {
        ownerId_recipientId_listId: {
          ownerId: userId,
          recipientId,
          listId,
        },
      },
    });

    if (!result) {
      throw internalServerError('Failed to delete share connect');
    }
  }

  // TODO Не використовується
  async _canIDoSomething({
    userId,
    listId,
    accessTypes,
  }: enoughRightInterface) {
    const list = await prisma.list.findFirst({
      where: { id: listId },
      select: {
        userId: true,
        sharedWith: {
          where: { recipientId: userId },
          select: { accessTypes: true },
        },
      },
    });

    if (!list) return false;

    if (list.userId === userId) return true;

    const shared = list.sharedWith[0];

    if (!shared) return false;

    return ACCESS_LEVEL[shared.accessTypes] >= ACCESS_LEVEL[accessTypes];
  }
}

export default new ListServices();
