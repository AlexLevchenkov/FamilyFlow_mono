import type {
  CreateGoalRequest,
  GoalModel,
  PaginatedResponse,
  UpdateGoalRequest,
} from "@familyflow/contracts";
import { interfaceToOpenAPI } from "@utils";

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

const now = new Date();

const vacationFund: GoalModel = {
  id: 1,
  familyId: 1,
  createdById: 1,
  title: "[seed] Vacation fund",
  description: "Save for a family trip",
  type: "AMOUNT",
  status: "ACTIVE",
  currentValue: 250,
  targetValue: 2000,
  unit: "cash",
  currency: "USD",
  startsAt: daysFromNow(-10),
  dueDate: daysFromNow(90),
  createdAt: now,
  updatedAt: now,
};

const goals: GoalModel[] = [
  vacationFund,
  {
    id: 2,
    familyId: 1,
    createdById: 2,
    title: "[seed] Books read",
    description: "Family reading challenge",
    type: "COUNTER",
    status: "COMPLETED",
    currentValue: 12.0,
    targetValue: 12,
    unit: "books",
    currency: null,
    startsAt: daysFromNow(-60),
    dueDate: daysFromNow(-1),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    familyId: 1,
    createdById: 4,
    title: "[seed] Kitchen remodel",
    description: "Step-by-step home project",
    type: "STEPS",
    status: "ARCHIVED",
    currentValue: 1,
    targetValue: 3,
    unit: "steps",
    currency: null,
    startsAt: daysFromNow(-30),
    dueDate: daysFromNow(120),
    createdAt: now,
    updatedAt: now,
  },
];

export const goalSchemas = {
  PaginatedItemsListResponse: interfaceToOpenAPI<PaginatedResponse<GoalModel>>({
    data: goals,
    pagination: {
      total: goals.length,
      page: 1,
      limit: Number(process.env.ITEMS_PER_PAGE) || 20,
      totalPages: 1,
    },
  }),
  CreateItemsListRequest: interfaceToOpenAPI<CreateGoalRequest>({
    title: vacationFund.title,
    description: vacationFund.description,
    type: vacationFund.type,
    status: vacationFund.status,
    currentValue: vacationFund.currentValue,
    targetValue: vacationFund.targetValue,
    unit: vacationFund.unit,
    currency: vacationFund.currency,
    startsAt: vacationFund.startsAt,
    dueDate: vacationFund.dueDate,
  }),
  UpdateItemsListRequest: interfaceToOpenAPI<UpdateGoalRequest>({
    id: vacationFund.id,
    title: vacationFund.title,
    description: vacationFund.description,
    status: vacationFund.status,
    currentValue: vacationFund.currentValue,
    targetValue: vacationFund.targetValue,
    unit: vacationFund.unit,
    currency: vacationFund.currency,
    dueDate: vacationFund.dueDate,
  }),
  ItemResponse: interfaceToOpenAPI<GoalModel>(vacationFund),
};
