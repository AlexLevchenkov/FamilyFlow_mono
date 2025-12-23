import { PaginatedResponse } from "@appTypes/common.types";import {
  CreateListRequest,
  List,
  UpdateListRequest,
} from "@appTypes/list.types";
import { ShareListInput } from "@middleware/schemas/list";
import { SharedLists } from "@prisma/client";
import { interfaceToOpenAPI } from "@utils/interfaceToOpenAPI";

export const listsSchemas = {
  PaginatedListsResponse: interfaceToOpenAPI<PaginatedResponse<List>>({
    data: [
      {
        id: 1,
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
  CreateListRequest: interfaceToOpenAPI<CreateListRequest>({
    title: "New list",
    type: "tasks",
    color: "Red",
    icon: "Box",
  }),
  UpdateListRequest: interfaceToOpenAPI<UpdateListRequest>({
    title: "New list",
    type: "tasks",
    color: "Red",
    icon: "Box",
  }),
  ListResponse: interfaceToOpenAPI<List>({
    id: 1,
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
  }),
  shareListResponse: interfaceToOpenAPI<SharedLists>({
    id: 1,
    listId: 1,
    ownerId: 1,
    recipientId: 2,
    createdAt: new Date(),
  }),
};
