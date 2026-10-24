import { makeValidator } from "@utils/validation";
import z from "zod";

const getListItemsSchema = z.object({
  listId: z.coerce.number(),
  page: z.coerce.number().optional(),
});

const getListItemSchema = z.object({
  id: z.coerce.number(),
});

const createItemSchema = z.object({
  listId: z.coerce.number(),
  title: z.coerce.string(),
  description: z.coerce.string().optional(),
  completed: z.coerce.boolean(),
  priority: z.coerce.number().default(0),
  dueDate: z.coerce.date().optional(),
  position: z.coerce.number().default(0),
});

const updateItemSchema = z.object({
  id: z.coerce.number(),
  listId: z.coerce.number(),
  title: z.coerce.string().optional(),
  description: z.coerce.string().optional(),
  completed: z.coerce.boolean().optional(),
  priority: z.coerce.number().optional(),
  dueDate: z.coerce.date().optional(),
  position: z.coerce.number().optional(),
});

const deleteItemSchema = z.object({
  id: z.coerce.number(),
});

export const validateGetListItems = makeValidator(getListItemsSchema, {
  query: true,
});
export const validateGetListItem = makeValidator(getListItemSchema, {
  params: true,
});
export const validateCreateItem = makeValidator(createItemSchema, {
  params: true,
  body: true,
});
export const validateUpdateItem = makeValidator(updateItemSchema, {
  params: true,
  body: true,
});
export const validateDeleteItem = makeValidator(deleteItemSchema, {
  params: true,
});
