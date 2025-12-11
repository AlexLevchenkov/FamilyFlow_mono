import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '@utils/errors';
import z from 'zod';

export const makeValidator = (schema: z.ZodTypeAny, messagePrefix = 'Validation error: ') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.body || typeof req.body !== 'object') {
        next(new ValidationError('Invalid request body'));
        return;
      }

      const parseResult = schema.safeParse(req.body);
      if (!parseResult.success) {
        const msg = messagePrefix.endsWith(' ') ? messagePrefix + JSON.stringify(parseResult.error.format()) : messagePrefix + JSON.stringify(parseResult.error.format());
        next(new ValidationError(msg));
        return;
      }

      next();
    } catch (error) {
      next(new AppError('Validation middleware error', 500));
    }
  };
};
