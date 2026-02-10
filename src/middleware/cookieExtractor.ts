import type { Request, Response, NextFunction } from 'express';
import { getDataFromRefreshToken } from "@utils/tokens";

// middleware: takes refreshToken from cookie (if present) and attaches to req.refreshToken
export default function cookieExtractor(req: Request, res: Response, next: NextFunction) {
  // cookie-parser must be used earlier in middleware chain
  const maybe = req.cookies?.refreshToken;

  if (maybe) {
    req.refreshToken = String(maybe);

    const data = getDataFromRefreshToken(maybe);

    if (data && typeof data != "string") {
      req.user = {id: Number(data.userId || 0), jti: data.jti || ""};
    }
  }
  next();
}
