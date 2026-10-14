import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      id: number;
      jti: string;
      role?: string;
    };
    refreshToken?: string;
    validated?: any;
  }
}

export {};
