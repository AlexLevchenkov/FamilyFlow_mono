import { PaginatedResponse } from "@appTypes/common.types";
import { UpdateUserRequest } from "@appTypes/users.types";
import { RegisterInput } from "@middleware/schemas/user";
import type { User as UserModel } from "@prisma/client";
import { interfaceToOpenAPI } from "@utils/interfaceToOpenAPI";

type UserPublic = Pick<UserModel, "name" | "avatar">;

export const usersSchemas = {
  PaginatedUsersResponse: interfaceToOpenAPI<PaginatedResponse<UserPublic>>({
    data: [
      {
        name: "John Doe",
        avatar: "https://example.com/jone-doe-avatar",
      },
    ],
    pagination: {
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  }),
  CreateUserRequest: interfaceToOpenAPI<RegisterInput>({
    email: "user@example.com",
    password: "Password123!@#",
    name: "John Doe",
  }),
  UpdateUserRequest: interfaceToOpenAPI<UpdateUserRequest>({
    email: "user@example.com",
    name: "John Doe",
    avatar: "https/example.com/jone-doe-avatar",
  }),
  UserResponse: interfaceToOpenAPI<UserPublic>({
    name: "John Doe",
    avatar: "https://example.com/jone-doe-avatar",
  }),
};
