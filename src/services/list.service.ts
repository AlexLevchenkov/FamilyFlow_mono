import prisma from "@config/prisma";
import { DeleteListInput, GetListInput, GetUserListsInput, CreateListInput, UpdateListInput, WithUserId, ShareListInput } from "@middleware/schemas/list";
import { badRequestError } from "@utils/errors";

class ListServices {
  async getUserLists({ userId, page }: WithUserId<GetUserListsInput>) {
    const where = {
      OR: [{ userId }, { sharedWith: { some: { recipientId: userId } } }],
    };

    const lists = await prisma.list.findMany({
      where,
      skip: page ? Number(page) * 20 : 0,
      take: 20,
      orderBy: { updatedAt: "desc" },
    });

    if (lists.length === 0) {
      badRequestError("Can't get any list");
      return;
    }

    const total = await prisma.list.count({ where });

    return {
      data: lists,
      pagination: {
        total,
        page: page || 1,
        limit: 20,
        totalPages: Math.ceil(total / 20),
      },
    };
  }

  async getListById({ id }: GetListInput) {
    const list = await prisma.list.findFirst({ where: { id } });

    if (!list) {
      badRequestError("List not found");
      return;
    }

    return list;
  }

  async createList({ userId, title, type, color, icon }: WithUserId<CreateListInput>) {
    const haveList = await prisma.list.findFirst({
      where: { userId, title, type },
    });

    if (haveList) {
      badRequestError("List already exists");
      return null;
    }

    const newList = await prisma.list.create({
      data: { userId, title, type, color, icon },
    });

    return newList;
  }

  async updateList({ userId, id, title, type, color, icon }: WithUserId<UpdateListInput>) {
    const haveList = await prisma.list.findFirst({
      where: { userId, id },
    });

    if (!haveList) {
      badRequestError("List not found");
      return;
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
      return true;
    }

    const result = await prisma.list.delete({ where: { userId, id } });

    if (!result) {
      badRequestError("Failed to delete list");
      return;
    }

    return true;
  }

  async shareList({ listId, userId, recipientId }: WithUserId<ShareListInput>) {
    const sharedWith = await prisma.sharedLists.create({
      data: { listId, ownerId: userId, recipientId },
    });

    if (!sharedWith) {
      badRequestError("Failed to create share list");
      return;
    }

    return sharedWith;
  }

  async removeSharingList({ listId, userId, recipientId }: WithUserId<ShareListInput>) {
    const sharedWith = await prisma.sharedLists.findFirst({
      where: { listId, ownerId: userId, recipientId },
    });

    if (!sharedWith) {
      badRequestError("Failed to find share connect");
      return;
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
      badRequestError("Failed to delete share connect");
      return;
    }

    return true;
  }
}

export default new ListServices();
