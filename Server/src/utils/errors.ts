import { logError } from './logger';

export class AppError extends Error {
  public statusCode: number;
  public textMessage: string;

  constructor(message: string, statusCode: number = 500) {
    logError(message);
    super(message);
    this.statusCode = statusCode;
    this.textMessage = message;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function badRequestError(message: string = 'Bad request') {
  return new AppError(message, 400);
}

export function unauthorizedError(message: string = 'Unauthorized') {
  return new AppError(message, 401);
}

export function notFoundError(message: string = 'Resource not found') {
  return new AppError(message, 404);
}

export function alreadyExistError(message: string = 'Resource already exist') {
  return new AppError(message, 409);
}

export function internalServerError(message: string = 'Internal Server Error') {
  return new AppError(message, 500);
}

export class ValidationError extends AppError {
  public details?: unknown;

  constructor(message: string = 'Validation error', details?: unknown) {
    super(message, 400);
    this.details = details;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
