import { logError } from "./logger";

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
    logError(message);
  }
}

export function notFoundError(message: string = "Resource not found") {
  return new AppError(message, 404);
}

export function badRequestError(message: string = "Bad request") {
  return new AppError(message, 400);
}

export function unauthorizedError(message: string = "Unauthorized") {
  return new AppError(message, 401);
}

export class ValidationError extends AppError {
  public details?: unknown;

  constructor(message: string = "Validation error", details?: unknown) {
    super(message, 400);
    this.details = details;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
