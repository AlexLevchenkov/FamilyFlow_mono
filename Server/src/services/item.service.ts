import prisma from "@config/prisma";
import {
  CreateItemInput,
  DeleteItemInput,
  GetListItemInput,
  GetListItemsInput,
  GetListsItemsInput,
  UpdateItemInput,
} from "@middleware";
import { internalServerError, notFoundError } from "@utils";

class ItemService {
  async getListItems({ listId, page = 1 }: GetListItemsInput) {
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
      throw notFoundError("Can`t find item per ID");
    }

    return item;
  }

  async createListItem({
    listId,
    title,
    completed = false,
    priority = 0,
    position = 0,
    description = "",
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
      throw internalServerError("Can't create new Item");
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
  }: UpdateItemInput) {
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
      throw internalServerError("Can't update Item");
    }

    return updatedItem;
  }

  async deleteListItem({ id }: DeleteItemInput) {
    const deletedItem = await prisma.item.delete({ where: { id } });

    if (!deletedItem) {
      throw internalServerError("Can't delete Item");
    }
  }
}

export default new ItemService();
