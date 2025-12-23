import { getDataFromRefreshToken } from "@utils/tokens";
import { Request, Response, NextFunction } from "express";

export interface RequestTU extends Request {
  user?: {
    id: number;
    role?: string;
  };
  refreshToken?: string;
  validated?: any;
}

// middleware: takes refreshToken from cookie (if present) and attaches to req.refreshToken
export default function cookieExtractor(req: RequestTU, res: Response, next: NextFunction) {
  // cookie-parser must be used earlier in middleware chain
  const maybe = req.cookies?.refreshToken || req.cookies?.refresh_token;

  if (maybe) {
    req.refreshToken = String(maybe);

    const data = getDataFromRefreshToken(maybe);

    if (data && typeof data != "string") {
      req.user = { id: -1 };
      req.user.id = Number(data.userId || 0);
    }
  }
  next();
}
