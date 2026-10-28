import type {
  PaginatedResponse,
  RegisterUserBody,
  UpdateUserBody,
  UserPublic,
} from "@familyflow/contracts";
import { interfaceToOpenAPI } from "@utils";

const owner: UserPublic = {
  name: "Seed Owner",
  avatar: "https://example.com/avatars/seed-owner.png",
};

export const usersSchemas = {
  PaginatedUsersResponse: interfaceToOpenAPI<PaginatedResponse<UserPublic>>({
    data: [
      owner,
      { name: "Seed Parent", avatar: null },
      { name: "Seed Child", avatar: null },
      { name: "Seed Member", avatar: null },
      { name: "Seed Outsider", avatar: null },
    ],
    pagination: {
      total: 5,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  }),
  CreateUserRequest: interfaceToOpenAPI<RegisterUserBody>({
    email: "seed.owner@familyflow.test",
    password: "SeedPass1!",
    name: "Seed Owner",
  }),
  UpdateUserBody: interfaceToOpenAPI<UpdateUserBody>({
    userId: 1,
    email: "seed.owner@familyflow.test",
    name: "Seed Owner",
    avatar: "https://example.com/avatars/seed-owner.png",
  }),
  UserResponse: interfaceToOpenAPI<UserPublic>(owner),
};
