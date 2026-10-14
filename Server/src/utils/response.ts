import { Response } from "express";

function apiResponse<T>(
  res: Response,
  data: T,
  status: number = 200,
  error?: string
) {
  return res.status(status).json({
    success: !error,
    data,
    error,
  });
}

export default apiResponse;
