import { authSchemas } from './auth';
import { listsSchemas } from './list';
import { itemsListSchemas } from './listItem';
import { usersSchemas } from './user';
import { familySchemas } from './family';
import { goalSchemas } from './goal';

export const schemas = {
  ...authSchemas,
  ...listsSchemas,
  ...itemsListSchemas,
  ...usersSchemas,
  ...familySchemas,
  ...goalSchemas,
};
