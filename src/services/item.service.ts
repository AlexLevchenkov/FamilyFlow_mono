import prisma from "@config/prisma";
import {
  CreateItemInput,
  DeleteItemInput,
  GetListItemInput,
  GetListItemsInput,
  UpdateItemInput,
} from "@middleware/schemas/item";
import { badRequestError, notFoundError } from "@utils/errors";

class ItemService {
  async getListItems({ listId, page }: GetListItemsInput) {
    const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 20;

    const items = await prisma.item.findMany({
      where: { listId },
      skip: page ? (page - 1) * itemsPerPage : undefined,
      take: itemsPerPage,
      orderBy: [{ completed: "desc" }, { priority: "desc" }, { title: "asc" }],
    });

    const total = await prisma.item.count({ where: { listId } });

    return {
      data: items,
      pagination: {
        total,
        page: page || 1,
        limit: itemsPerPage,
        totalPages: Math.ceil(total / itemsPerPage),
      },
    };
  }

  async getListItemById({ id }: GetListItemInput) {
    const item = await prisma.item.findFirst({
      where: { id },
    });

    if (!item) {
      notFoundError("Can`t find item per ID");
      return;
    }

    return item;
  }

  async createListItem({
    listId,
    title,
    completed,
    priority,
    position,
    description,
    dueDate,
  }: CreateItemInput) {
    const createdItem = await prisma.item.create({
      data: {
        listId,
        title,
        completed,
        priority,
        position,
        description,
        dueDate,
      },
    });

    if (!createdItem) {
      badRequestError("Can't create new Item");
      return;
    }

    return createdItem;
  }

  async updateListItem({
    id,
    listId,
    title,
    completed,
    priority,
    position,
    description,
    dueDate,
  }: UpdateItemInput & { id: number }) {
    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        listId,
        title,
        completed,
        priority,
        position,
        description,
        dueDate,
      },
    });

    if (!updatedItem) {
      badRequestError("Can't update Item");
      return;
    }

    return updatedItem;
  }

  async deleteListItem({ id }: DeleteItemInput) {
    const deletedItem = await prisma.item.delete({ where: { id } });

    if (!deletedItem) {
      badRequestError("Can't delete Item");
      return;
    }

    return true;
  }
}

export default new ItemService();
