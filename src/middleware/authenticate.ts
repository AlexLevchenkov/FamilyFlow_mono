import type { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import keyRotationService from "@utils/keyRotation";
import { AppError, unauthorizedError } from "@utils/errors";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
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
      jti: "",
    };

    next();
  } catch (error) {
    next(new AppError("Authentication middleware error", 500));
  }
}