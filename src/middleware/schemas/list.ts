import z from "zod";
import { makeValidator } from "@utils/validation";
import { AccessTypes, Type } from "@prisma/client";

export type WithUserId<T> = T & { userId: number };

const type = ["shopping", "tasks", "events"] as Type[];
const accessTypes = ["edit", "fullAccess", "watch"] as AccessTypes[];

const getUserListsSchema = z.object({
  page: z.coerce.number().refine((page) => page > 0, "Min page value is 1"),
});

const getListSchema = z.object({
  id: z.coerce.number(),
});

const createListSchema = z.object({
  title: z.string().min(1),
  type: z.enum(type),
  color: z.string().optional(),
  icon: z.string().optional(),
});

const updateListSchema = z.object({
  id: z.coerce.number(),
  title: z.string().min(1),
  type: z.enum(type),
  color: z.string().optional(),
  icon: z.string().optional(),
});

const deleteListSchema = z.object({
  id: z.coerce.number(),
});

const shareListSchema = z.object({
  listId: z.number(),
  recipientId: z.number(),
  accessTypes: z.enum(accessTypes)
});

const removeSharingListSchema = z.object({
  listId: z.string(),
  ownerId: z.string(),
  recipientId: z.string(),
})

export type GetUserListsInput = z.infer<typeof getUserListsSchema>;
export type GetListInput = z.infer<typeof getListSchema>;
export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
export type DeleteListInput = z.infer<typeof deleteListSchema>;
export type ShareListInput = z.infer<typeof shareListSchema>;
export type removeSharingListInput = z.infer<typeof removeSharingListSchema>;

export const validateGetUserLists = makeValidator(getUserListsSchema, {
  query: true,
});
export const validateGetList = makeValidator(getListSchema, {
  params: true
});
export const validateCreateList = makeValidator(createListSchema, {
  body: true,
});
export const validateUpdateList = makeValidator(updateListSchema, {
  body: true,
  params: true,
});
export const validateDeleteList = makeValidator(deleteListSchema, {
  params: true,
});
export const validateShareList = makeValidator(shareListSchema, {
  body: true
});
export const validateRemoveSharingList = makeValidator(removeSharingListSchema, {
  query: true
});
