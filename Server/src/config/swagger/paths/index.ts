import { authPaths } from './auth';
import { itemListPaths } from './item';
import { listPaths } from './lists';
import { userPaths } from './users';

export const paths = {
  ...authPaths,
  ...listPaths,
  ...itemListPaths,
  ...userPaths,
};
