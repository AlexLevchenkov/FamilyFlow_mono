import { authPaths } from './auth';
import { userPaths } from './users';

export const paths = {
    ...authPaths,
    ...userPaths,
};
