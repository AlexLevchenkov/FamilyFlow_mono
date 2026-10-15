import type { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "@utils/errors";
import z from "zod";

type ValidatorSources = {
  body?: boolean;
  query?: boolean;
  params?: boolean;
};

export const makeValidator = (
  schema: z.ZodTypeAny,
  sources: ValidatorSources = { body: true },
  messagePrefix = "Validation error:"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = {
        ...(sources.body ? req.body : {}),
        ...(sources.query ? req.query : {}),
        ...(sources.params ? req.params : {}),
      };

      const parseResult = schema.safeParse(data);

      if (!parseResult.success) {
        next(
          new ValidationError(
            "Path: " +
              req.originalUrl +
              ". \n " +
              messagePrefix +
              parseResult.error.issues.map(e => e.message).join(", ")
          )
        );
        return;
      }

      req.validated = parseResult.data;

      next();
    } catch {
      next(new AppError("Validation middleware error", 500));
    }
  };
};
