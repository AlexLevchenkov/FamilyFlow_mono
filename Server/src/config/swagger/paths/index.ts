import { authPaths } from "./auth";
import { itemListPaths } from "./item";
import { listPaths } from "./lists";
import { userPaths } from "./users";
import { familyPaths } from "./family";
import { goalsPaths } from "./goals";

export const paths = {
  ...authPaths,
  ...listPaths,
  ...itemListPaths,
  ...userPaths,
  ...familyPaths,
  ...goalsPaths,
};
