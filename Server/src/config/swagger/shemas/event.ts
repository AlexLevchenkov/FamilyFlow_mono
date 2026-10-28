import type {
  CreateEventBody,
  EventModel,
  PaginatedResponse,
  UpdateEventBody,
} from "@familyflow/contracts";
import { interfaceToOpenAPI } from "@utils";

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

const now = new Date();

const morningStandup: EventModel = {
  id: 1,
  userId: 1,
  title: "[seed] Morning standup",
  color: "#2563eb",
  date: daysFromNow(0),
  repeatability: "day",
  createdAt: now,
  updatedAt: now,
};

const events: EventModel[] = [
  morningStandup,
  {
    id: 2,
    userId: 2,
    title: "[seed] School drop-off",
    color: "#16a34a",
    date: daysFromNow(1),
    repeatability: "working",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    userId: 3,
    title: "[seed] Piano lesson",
    color: "#9333ea",
    date: daysFromNow(2),
    repeatability: "week",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    userId: 4,
    title: "[seed] Rent due",
    color: "#dc2626",
    date: daysFromNow(5),
    repeatability: "month",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 5,
    userId: 1,
    title: "[seed] Family budget review",
    color: "#ca8a04",
    date: daysFromNow(14),
    repeatability: "quarter",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 6,
    userId: 2,
    title: "[seed] Anniversary",
    color: "#db2777",
    date: daysFromNow(30),
    repeatability: "year",
    createdAt: now,
    updatedAt: now,
  },
];

export const eventSchemas = {
  PaginatedEventsResponse: interfaceToOpenAPI<PaginatedResponse<EventModel>>({
    data: events,
    pagination: {
      total: events.length,
      page: 1,
      limit: Number(process.env.ITEMS_PER_PAGE) || 20,
      totalPages: 1,
    },
  }),
  CreateEventBody: interfaceToOpenAPI<CreateEventBody>({
    title: morningStandup.title,
    color: morningStandup.color,
    date: morningStandup.date,
    repeatability: morningStandup.repeatability,
  }),
  UpdateEventBody: interfaceToOpenAPI<UpdateEventBody>({
    title: morningStandup.title,
    color: morningStandup.color,
    date: morningStandup.date,
    repeatability: morningStandup.repeatability,
  }),
  EventResponse: interfaceToOpenAPI<EventModel>(morningStandup),
};
