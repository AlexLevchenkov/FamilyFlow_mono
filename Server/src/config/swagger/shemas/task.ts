import type {
  CreateTaskBody,
  TaskModel,
  PaginatedResponse,
  UpdateTaskBody,
} from "@familyflow/contracts";
import { interfaceToOpenAPI } from "@utils";

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

const now = new Date();

const groceryRun: TaskModel = {
  id: 1,
  userId: 1,
  title: "[seed] Grocery run",
  type: "home",
  visibility: "shared",
  status: false,
  date: daysFromNow(1),
  createdAt: now,
  updatedAt: now,
};

const tasks: TaskModel[] = [
  groceryRun,
  {
    id: 2,
    userId: 2,
    title: "[seed] Family movie night",
    type: "family",
    visibility: "shared",
    status: false,
    date: daysFromNow(3),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    userId: 1,
    title: "[seed] Finish quarterly report",
    type: "work",
    visibility: "personal",
    status: false,
    date: daysFromNow(5),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    userId: 2,
    title: "[seed] Evening walk",
    type: "health",
    visibility: "personal",
    status: false,
    date: daysFromNow(0),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 5,
    userId: 4,
    title: "[seed] Pay utility bills",
    type: "finance",
    visibility: "secret",
    status: false,
    date: daysFromNow(2),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 6,
    userId: 3,
    title: "[seed] Math homework",
    type: "learning",
    visibility: "personal",
    status: false,
    date: daysFromNow(1),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 7,
    userId: 5,
    title: "[seed] Personal journal",
    type: "personal",
    visibility: "secret",
    status: false,
    date: daysFromNow(7),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 8,
    userId: 4,
    title: "[seed] Call grandparents",
    type: "social",
    visibility: "shared",
    status: false,
    date: daysFromNow(4),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 9,
    userId: 2,
    title: "[seed] Pack weekend bags",
    type: "travel",
    visibility: "shared",
    status: false,
    date: daysFromNow(10),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 10,
    userId: 1,
    title: "[seed] Unsorted errands",
    type: "other",
    visibility: "personal",
    status: false,
    date: daysFromNow(6),
    createdAt: now,
    updatedAt: now,
  },
];

export const tasksSchemas = {
  PaginatedItemsListResponse: interfaceToOpenAPI<PaginatedResponse<TaskModel>>({
    data: tasks,
    pagination: {
      total: tasks.length,
      page: 1,
      limit: Number(process.env.ITEMS_PER_PAGE) || 20,
      totalPages: 1,
    },
  }),
  CreateItemsListRequest: interfaceToOpenAPI<CreateTaskBody>({
    title: groceryRun.title,
    type: groceryRun.type,
    visibility: groceryRun.visibility,
    date: groceryRun.date,
  }),
  UpdateItemsListRequest: interfaceToOpenAPI<UpdateTaskBody>({
    title: groceryRun.title,
    type: groceryRun.type,
    visibility: groceryRun.visibility,
    status: groceryRun.status,
    date: groceryRun.date,
  }),
  ItemResponse: interfaceToOpenAPI<TaskModel>(groceryRun),
};
