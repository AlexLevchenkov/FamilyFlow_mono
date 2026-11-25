import { authPaths } from "./auth";
import { eventPaths } from "./event";
import { goalPaths } from "./goal";
import { searchPaths } from "./search";
import { taskPaths } from "./task";
import { userPaths } from "./user";
import { familyPaths } from "./family";

export const paths = {
  ...authPaths,
  ...eventPaths,
  ...familyPaths,
  ...goalPaths,
  ...searchPaths,
  ...taskPaths,
  ...userPaths,
};
