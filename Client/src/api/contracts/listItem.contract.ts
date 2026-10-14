import type { PaginatedResponse } from './common.contract';

/**
 * ListItem entity returned by the server (Item model in Prisma)
 */
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

/**
 * Query parameters for GET /listItem
 */
export interface GetListItemsParams {
  listId: number;
  page?: number;
}

/**
 * Paginated list items response from GET /listItem
 */
export type PaginatedListItemsResponse = PaginatedResponse<ListItemModel>;

/**
 * Body payload for POST /listItem
 */
export interface CreateListItemRequest {
  listId: number;
  title: string;
  completed: boolean;
  description?: string;
  priority?: number;
  dueDate?: string | Date;
  position?: number;
}

/**
 * Body payload for PUT /listItem/:id
 */
export interface UpdateListItemRequest {
  listId: number;
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: number;
  dueDate?: string | Date;
  position?: number;
}
