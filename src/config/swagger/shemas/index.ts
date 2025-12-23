import { authSchemas } from "./auth";
import { listsSchemas } from "./list";
import { usersSchemas } from "./user";

export const schemas = {
  ...authSchemas,
  ...listsSchemas,
  ...usersSchemas,
};
