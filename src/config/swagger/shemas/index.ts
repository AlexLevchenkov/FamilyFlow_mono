import { authSchemas } from './auth';
import { usersSchemas } from './user';

export const schemas = {
  ...authSchemas,
  ...usersSchemas,
};
