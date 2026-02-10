import { TMode } from '@appTypes/common.types';
import type { Request, Response, NextFunction } from 'express';

export default function platformIdentifier(req: Request, res: Response, next: NextFunction) {
  const mode = req.header('X-Auth-Mode');
  if (mode) {
    req.mode = mode as TMode;
  }
  next();
}