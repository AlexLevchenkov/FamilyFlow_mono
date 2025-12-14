import z from 'zod';
import { makeValidator } from '@utils/validation';
import { Type } from '@prisma/client';

export type WithUserId<T> = T & { userId: number };

const type = ["shopping", "tasks", "events"] as Type[];

const getUserListsSchema = z.object({
	page: z.coerce.string().optional(),
})

const getListSchema = z.object({
	id: z.coerce.number(),
})

const createListSchema = z.object({
	title: z.string(),
	type: z.enum(type),
	color: z.string(),
	icon: z.string(),
})

const updateListSchema = z.object({
	id: z.coerce.number(),
	title: z.string(),
	type: z.enum(type),
	color: z.string(),
	icon: z.string(),
})

const deleteListSchema = z.object({
	id: z.coerce.number(),
})

export type GetUserListsInput = z.infer<typeof getUserListsSchema>;
export type GetListInput = z.infer<typeof getListSchema>;
export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
export type DeleteListInput = z.infer<typeof deleteListSchema>;

export const validateGetUserLists = makeValidator(getUserListsSchema, { params: true });
export const validateGetList = makeValidator(getListSchema, { params: true });
export const validateCreateList = makeValidator(createListSchema, { body: true });
export const validateUpdateList = makeValidator(updateListSchema, { body: true, params: true });
export const validateDeleteList = makeValidator(deleteListSchema, { params: true });
