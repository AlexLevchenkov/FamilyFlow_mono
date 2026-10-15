export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  page: number | string;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface AuthUser {
  name: string | null;
  avatar: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginDto = LoginRequest;

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export type AuthResponse = LoginResponse;

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export type ForgotPasswordDto = ForgotPasswordRequest;

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export type ResetPasswordDto = ResetPasswordRequest;

export interface VerifyEmailQuery {
  token: string;
}

export interface LogoutQuery {
  jti?: string;
}

export interface UserPublic {
  name: string | null;
  avatar: string | null;
}

export type IUser = UserPublic;

export interface UserDetail {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersParams {
  page?: number | string;
  partName?: string;
  partEmail?: string;
}

export type PaginatedUsersResponse = PaginatedResponse<UserPublic>;

export interface RegisterUserRequest {
  email: string;
  password: string;
  name: string;
}

export type RegisterUserResponse = UserPublic;

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  avatar?: string;
  userId?: number;
}

export interface DeleteUserParams {
  userId: number;
}

export type ListType = 'shopping' | 'tasks' | 'events';

export type AccessType = 'watch' | 'edit' | 'fullAccess';

export interface ListModel {
  id: number;
  userId: number;
  title: string;
  type: ListType;
  color: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SharedListModel {
  id: number;
  listId: number;
  ownerId: number;
  recipientId: number;
  accessTypes: AccessType;
  createdAt: string;
}

export interface GetUserListsParams {
  page?: number;
}

export type PaginatedListsResponse = PaginatedResponse<ListModel>;

export interface CreateListRequest {
  title: string;
  type: ListType;
  color?: string;
  icon?: string;
}

export interface UpdateListRequest {
  title: string;
  type: ListType;
  color?: string;
  icon?: string;
}

export interface ShareListRequest {
  listId: number;
  recipientId: number;
  accessTypes: AccessType;
}

export interface RemoveSharingListParams {
  listId: number;
  ownerId: number;
  recipientId: number;
}

export interface ListItemModel {
  id: number;
  listId: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: number;
  dueDate: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface GoalModel {
  id: number;
  familyId: number;
  title: string;
  category: string;
  progress: number;
  detail: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalRequest {
  title: string;
  category: string;
  progress?: number;
  detail?: string;
  color?: string;
}

export interface UpdateGoalRequest {
  title?: string;
  category?: string;
  progress?: number;
  detail?: string | null;
  color?: string;
}

export interface FamilyMemberModel {
  id: number;
  userId: number;
  email: string;
  name: string | null;
  avatar: string | null;
  isOwner: boolean;
  joinedAt: string;
}

export interface FamilyModel {
  id: number;
  ownerId: number;
  name: string;
  members: FamilyMemberModel[];
  createdAt: string;
  updatedAt: string;
}

export interface AddFamilyMemberRequest {
  email: string;
}

export interface GetListItemsParams {
  listId: number;
  page?: number;
}

export type PaginatedListItemsResponse = PaginatedResponse<ListItemModel>;

export interface CreateListItemRequest {
  listId: number;
  title: string;
  completed: boolean;
  description?: string;
  priority?: number;
  dueDate?: string | Date;
  position?: number;
}

export interface UpdateListItemRequest {
  listId: number;
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: number;
  dueDate?: string | Date;
  position?: number;
}

export type RefreshResponse = RefreshTokenResponse;
export type ForgotPasswordResponse = ForgotPasswordRequest;
export type ResetPasswordResponse = ResetPasswordRequest;
export type EmailVerifyResponse = VerifyEmailQuery;
