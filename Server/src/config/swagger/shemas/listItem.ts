import { PaginatedResponse } from "@appTypes/common.types";
import { Item } from "@prisma/client";
import type {
  CreateListItemRequest,
  UpdateListItemRequest,
} from "@familyflow/contracts";
import { interfaceToOpenAPI } from "@utils";

const item: Item = {
  id: 1,
  listId: 1,
  title: "New list",
  description: "description",
  completed: false,
  priority: 0,
  dueDate: new Date(new Date().getDate() + 7 * 24 * 3600 * 1000),
  position: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const itemsListSchemas = {
  PaginatedItemsListResponse: interfaceToOpenAPI<PaginatedResponse<Item>>({
    data: [item],
    pagination: {
      total: 1,
      page: 1,
      limit: Number(process.env.ITEMS_PER_PAGE) || 20,
      totalPages: 1,
    },
  }),
  CreateItemsListRequest: interfaceToOpenAPI<CreateListItemRequest>({
    listId: item.listId,
    title: item.title,
    description: item.description || "",
    completed: item.completed,
    priority: item.priority,
    dueDate: item.dueDate || new Date(),
    position: item.position,
  }),
  UpdateItemsListRequest: interfaceToOpenAPI<UpdateListItemRequest>({
    listId: item.listId,
    title: item.title,
    description: item.description || "",
    completed: item.completed,
    priority: item.priority,
    dueDate: item.dueDate || new Date(),
    position: item.position,
  }),
  ItemResponse: interfaceToOpenAPI<Item>(item),
};
