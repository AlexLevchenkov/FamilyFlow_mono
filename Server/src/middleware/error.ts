import type { ErrorRequestHandler } from "express";
import apiResponse from "@utils/response";

const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  const statusCode =
    typeof error.statusCode === "number" &&
    error.statusCode >= 400 &&
    error.statusCode <= 599
      ? error.statusCode
      : 500;

  const message =
    statusCode === 500
      ? "Internal server error"
      : error.message || "An error occurred";

  apiResponse(res, null, statusCode, message);
};

export default errorHandler;