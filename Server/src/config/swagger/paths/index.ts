import { authPaths } from "./auth";
import { eventPaths } from "./event";
import { goalPaths } from "./goal";
import { taskPaths } from "./task";
import { userPaths } from "./user";
import { familyPaths } from "./family";

export const paths = {
  ...authPaths,
  ...eventPaths,
  ...familyPaths,
  ...goalPaths,
  ...taskPaths,
  ...userPaths,
};
