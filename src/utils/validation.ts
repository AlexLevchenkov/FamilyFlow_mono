import { Response, NextFunction } from 'express';
import { AppError, ValidationError } from '@utils/errors';
import z from 'zod';
import { RequestTU } from '@middleware/cookieExtractor';

type ValidatorSources = {
  body?: boolean;
  query?: boolean;
  params?: boolean;
};

export const makeValidator = (
  schema: z.ZodTypeAny,
  sources: ValidatorSources = { body: true },
  messagePrefix = 'Validation error: '
) => {
  return (req: RequestTU, res: Response, next: NextFunction): void => {
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
            messagePrefix + JSON.stringify(parseResult.error.format())
          )
        );
        return;
      }

      req.validated = parseResult.data;

      next();
    } catch {
      next(new AppError('Validation middleware error', 500));
    }
  };
};
