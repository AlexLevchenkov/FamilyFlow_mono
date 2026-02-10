import 'express-serve-static-core';
import { TMode } from './common.types';

declare module 'express-serve-static-core' {
  interface Request {
    user: {
      id: number;
      jti: string;
      role?: string;
    };
    refreshToken?: string;
    validated?: any;
    mode: TMode;
  }
}

export {};
