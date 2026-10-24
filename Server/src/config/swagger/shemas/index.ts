import { authSchemas } from "./auth";
import { eventSchemas } from "./event";
import { goalSchemas } from "./goal";
import { tasksSchemas } from "./task";
import { usersSchemas } from "./user";
import { familySchemas } from "./family";

export const schemas = {
  ...authSchemas,
  ...eventSchemas,
  ...familySchemas,
  ...goalSchemas,
  ...tasksSchemas,
  ...usersSchemas,
};
