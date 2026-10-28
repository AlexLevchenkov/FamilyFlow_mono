import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      id: number;
      jti: string;
    };
    refreshToken?: string;
    validated?: {
      body: any;
      query: any;
      params: any;
    };
  }
}

declare global {
  interface Window {
    ui: any;
  }
}

export {};
