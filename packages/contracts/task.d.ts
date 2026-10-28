import { PaginatedResponse } from "./base";

export type TaskType =
  | "home"
  | "family"
  | "work"
  | "health"
  | "finance"
  | "learning"
  | "personal"
  | "social"
  | "travel"
  | "other";

export type Visibility = "shared" | "personal" | "secret";

export interface TaskModel {
  id: number;
  userId: number;
  title: string;
  type: TaskType;
  visibility: Visibility;
  status: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetUserTasksParams {
  page?: number;
  limit?: number;
}

export type PaginatedTasksResponse = PaginatedResponse<TaskModel>;

export interface CreateTaskBody {
  title: string;
  type: TaskType;
  visibility: Visibility;
  date: Date;
}

export interface UpdateTaskBody {
  title: string;
  type: TaskType;
  visibility: Visibility;
  status: boolean;
  date: Date;
}
