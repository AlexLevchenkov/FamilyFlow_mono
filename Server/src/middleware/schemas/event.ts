import z from "zod";
import { makeValidator } from "@utils/validation";
import { Repeatability } from "@familyflow/contracts";

const repeatability = [
  "day",
  "working",
  "week",
  "month",
  "quarter",
  "year",
] as Repeatability[];

const getUserEventsSchema = z.object({
  page: z.coerce.number().refine(page => page > 0, "Min page value is 1"),
});

const getEventSchema = z.object({
  id: z.coerce.number(),
});

const createEventSchema = z.object({
  title: z.coerce.string().min(1),
  color: z.coerce.string().optional(),
  date: z.coerce.date().optional(),
  repeatability: z.enum(repeatability).optional(),
});

const updateEventSchema = z.object({
  id: z.coerce.number(),
  title: z.coerce.string().min(1),
  color: z.coerce.string(),
  date: z.coerce.date(),
  repeatability: z.enum(repeatability),
});

const deleteEventSchema = z.object({
  id: z.coerce.number(),
});

export const validateGetUserEvents = makeValidator(getUserEventsSchema, {
  query: true,
});
export const validateGetEvent = makeValidator(getEventSchema, {
  params: true,
});
export const validateCreateEvent = makeValidator(createEventSchema, {
  body: true,
});
export const validateUpdateEvent = makeValidator(updateEventSchema, {
  body: true,
  params: true,
});
export const validateDeleteEvent = makeValidator(deleteEventSchema, {
  params: true,
});
