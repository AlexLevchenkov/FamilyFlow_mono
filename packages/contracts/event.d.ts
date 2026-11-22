import { PaginatedResponse } from "./base";
import { Visibility } from "./task";

export type Repeatability =
  | "none"
  | "day"
  | "working"
  | "week"
  | "month"
  | "quarter"
  | "year";

export interface EventModel {
  id: number;
  userId: number;
  title: string;
  color: string;
  date: Date;
  originalDate?: Date;
  repeatability: Repeatability;
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetEventsParams {
  page?: number;
  limit?: number;
  from?: Date | string;
  to?: Date | string;
}

export type PaginatedEventsResponse = PaginatedResponse<EventModel>;

export interface CreateEventBody {
  title: string;
  color: string;
  date: Date;
  repeatability?: Repeatability;
  visibility?: Visibility;
}

export interface UpdateEventBody {
  title: string;
  color: string;
  date: Date;
  repeatability?: Repeatability;
  visibility?: Visibility;
}
