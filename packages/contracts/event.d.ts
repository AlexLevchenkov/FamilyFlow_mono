import { PaginatedResponse } from "./base";

export type Repeatability =
  "day" | "working" | "week" | "month" | "quarter" | "year";

export interface EventModel {
  id: number;
  userId: number;
  title: string;
  color: string;
  date: Date;
  repeatability: Repeatability;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetEventsParams {
  page?: number;
}

export type PaginatedEventsResponse = PaginatedResponse<EventModel>;

export interface CreateEventBody {
  title: string;
  color: string;
  date: Date;
  repeatability: Repeatability;
}

export interface UpdateEventBody {
  title: string;
  color: string;
  date: Date;
  repeatability: Repeatability;
}
