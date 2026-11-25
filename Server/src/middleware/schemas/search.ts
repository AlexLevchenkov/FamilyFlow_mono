import z from "zod";
import { makeValidator } from "@utils/validation";

const searchSchema = z.object({
  query: z.coerce.string().trim().min(1).max(100),
});

export type GlobalSearchInput = z.infer<typeof searchSchema>;

export const validateGlobalSearch = makeValidator(searchSchema, {
  query: true,
});
