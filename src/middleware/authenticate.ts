import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import keyRotationService from "@services/keyRotationService";
import { AppError, unauthorizedError } from "@utils/errors";
import { RequestTU } from "./cookieExtractor";

export default function authenticate(req: RequestTU, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next(unauthorizedError("No token provided"));
      return;
    }

    const [bearer, token] = authHeader.split(" ");
    
    if (bearer !== "Bearer" || !token) {
      next(unauthorizedError("Invalid token format"));
      return;
    }

    const currentKeys = keyRotationService.getCurrentKeys();
    const previousKeys = keyRotationService.getPreviousKeys();

    let payload: any;
    try {
      payload = jwt.verify(token, currentKeys.access);
    } catch {
      try {
        if (!previousKeys.previousAccess) {
          next(unauthorizedError("Invalid token"));
          return;
        }
        payload = jwt.verify(token, previousKeys.previousAccess);
      } catch {
        next(unauthorizedError("Invalid token"));
      }
    }

    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(new AppError("Authentication middleware error", 500));
  }
}