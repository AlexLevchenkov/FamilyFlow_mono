import { PaginatedResponse } from "@appTypes/common.types";
import { CreateListInput, ShareListInput, UpdateListInput } from "@/middleware";
import { List, SharedLists } from "@prisma/client";
import { interfaceToOpenAPI } from "@/utils";

export const listsSchemas = {
  PaginatedListsResponse: interfaceToOpenAPI<PaginatedResponse<List>>({
    data: [
      {
        id: 1,
        userId: 1,
        title: "New list",
        type: "tasks",
        color: "Red",
        icon: "Box",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    pagination: {
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  }),
  CreateListRequest: interfaceToOpenAPI<CreateListInput>({
    title: "New list",
    type: "tasks",
    color: "Red",
    icon: "Box",
  }),
  UpdateListRequest: interfaceToOpenAPI<Omit<UpdateListInput, "id">>({
    title: "New list",
    type: "tasks",
    color: "Red",
    icon: "Box",
  }),
  ListResponse: interfaceToOpenAPI<List>({
    id: 1,
    userId: 1,
    title: "New list",
    type: "tasks",
    color: "Red",
    icon: "Box",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  shareListRequest: interfaceToOpenAPI<ShareListInput>({
    listId: 1,
    recipientId: 2,
    accessTypes: "fullAccess",
  }),
  shareListResponse: interfaceToOpenAPI<SharedLists>({
    id: 1,
    listId: 1,
    ownerId: 1,
    recipientId: 2,
    createdAt: new Date(),
    accessTypes: "fullAccess",
  }),
};
