import { authPaths } from "./auth";
import { listPaths } from "./lists";
import { userPaths } from "./users";

export const paths = {
  ...authPaths,
  ...listPaths,
  ...userPaths,
};
