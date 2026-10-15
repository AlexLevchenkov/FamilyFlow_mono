import { PaginatedResponse } from '@appTypes/common.types';
import type { User } from '@prisma/client';
import type {
  RegisterUserRequest,
  UpdateUserRequest,
  UserPublic,
} from '@familyflow/contracts';
import { interfaceToOpenAPI } from '@/utils';

export const usersSchemas = {
  PaginatedUsersResponse: interfaceToOpenAPI<PaginatedResponse<UserPublic>>({
    data: [
      {
        name: 'John Doe',
        avatar: 'https://example.com/jone-doe-avatar',
      },
      {
        name: 'John Doe',
        avatar: 'https://example.com/jone-doe-avatar',
      },
      {
        name: 'John Doe',
        avatar: 'https://example.com/jone-doe-avatar',
      },
    ],
    pagination: {
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  }),
  CreateUserRequest: interfaceToOpenAPI<RegisterUserRequest>({
    email: 'user@example.com',
    password: 'Password123!@#',
    name: 'John Doe',
  }),
  UpdateUserRequest: interfaceToOpenAPI<UpdateUserRequest>({
    email: 'user@example.com',
    name: 'John Doe',
    avatar: 'https/example.com/jone-doe-avatar',
  }),
  UserResponse: interfaceToOpenAPI<UserPublic>({
    name: 'John Doe',
    avatar: 'https://example.com/jone-doe-avatar',
  }),
};
