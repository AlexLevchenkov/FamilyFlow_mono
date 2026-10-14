import { PaginatedResponse } from "@appTypes/common.types";
import type { User } from "@prisma/client";
import { RegisterInput, UpdateUserInput } from "@/middleware";
import { interfaceToOpenAPI } from "@/utils";

type UserPublic = Pick<User, "name" | "avatar">;

export const usersSchemas = {
  PaginatedUsersResponse: interfaceToOpenAPI<PaginatedResponse<UserPublic>>({
    data: [
      {
        name: "John Doe",
        avatar: "https://example.com/jone-doe-avatar",
      },
      {
        name: "John Doe",
        avatar: "https://example.com/jone-doe-avatar",
      },
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
  UpdateUserRequest: interfaceToOpenAPI<UpdateUserInput>({
    email: "user@example.com",
    name: "John Doe",
    avatar: "https/example.com/jone-doe-avatar",
  }),
  UserResponse: interfaceToOpenAPI<UserPublic>({
    name: "John Doe",
    avatar: "https://example.com/jone-doe-avatar",
  }),
};
