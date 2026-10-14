import { authSchemas } from "./auth";
import { listsSchemas } from "./list";
import { itemsListSchemas } from "./listItem";
import { usersSchemas } from "./user";

export const schemas = {
  ...authSchemas,
  ...listsSchemas,
  ...itemsListSchemas,
  ...usersSchemas,
};
