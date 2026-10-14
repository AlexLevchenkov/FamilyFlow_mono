import type { PaginatedResponse } from './common.contract';

/**
 * Types of lists supported by the server (enum Type in Prisma)
 */
export type ListType = 'shopping' | 'tasks' | 'events';

/**
 * Access levels for shared lists (enum AccessTypes in Prisma)
 */
export type AccessType = 'watch' | 'edit' | 'fullAccess';

/**
 * List entity returned by the server
 */
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

/**
 * Shared list relation entity
 */
export interface SharedListModel {
  id: number;
  listId: number;
  ownerId: number;
  recipientId: number;
  accessTypes: AccessType;
  createdAt: string;
}

/**
 * Query parameters for GET /list
 */
export interface GetUserListsParams {
  page?: number;
}

/**
 * Paginated lists response from GET /list
 */
export type PaginatedListsResponse = PaginatedResponse<ListModel>;

/**
 * Body payload for POST /list
 */
export interface CreateListRequest {
  title: string;
  type: ListType;
  color?: string;
  icon?: string;
}

/**
 * Body payload for PUT /list/:id
 */
export interface UpdateListRequest {
  title: string;
  type: ListType;
  color?: string;
  icon?: string;
}

/**
 * Body payload for POST /list/share
 */
export interface ShareListRequest {
  listId: number;
  recipientId: number;
  accessTypes: AccessType;
}

/**
 * Query parameters for DELETE /list/share
 */
export interface RemoveSharingListParams {
  listId: number;
  ownerId: number;
  recipientId: number;
}
