import { Request, Response } from "express";
import authService from "@services/auth.service";
import { logError } from "@utils/logger";
import apiResponse from "@utils/response";

class AuthController {
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const mode = req.mode;
      const data = await authService.login({ ...req.validated });

      if (mode === "WEB") {
        this.addRefreshTokenToCookie(res, data.refreshToken);
        apiResponse(res, { user: { ...data.user, password: null }, accessToken: data.accessToken }, 200);
      } else if (mode === "MOBILE") {
        apiResponse(res, { user: { ...data.user, password: null }, accessToken: data.accessToken, refreshToken: data.refreshToken }, 200);
      } else {
        apiResponse(res, null, 500, "Invalid or missed mode");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user, mode } = req;
      
      await authService.logout({ userId: user.id });

      if (mode === "WEB") {
        try {
          res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/auth/refresh-token",
          });
        } catch (err) {
          logError(
            "Failed to clear refresh token cookie: " +
            (err instanceof Error ? err.message : String(err))
          );
        }
      }

      apiResponse(res, null, 200, "Logged out successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user, mode } = req;

      const data = await authService.refreshToken({
        userId: user.id,
        jti: user.jti,
      });

      if (mode === "WEB") {
        this.addRefreshTokenToCookie(res, data.refreshToken);
        apiResponse(res, { accessToken: data.accessToken }, 200);
      } else if (mode === "MOBILE") {
        apiResponse(res, { accessToken: data.accessToken, refreshToken: data.refreshToken }, 200);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user } = req;

      await authService.changePassword({
        userId: user.id,
        ...req.validated,
      });

      apiResponse(res, null, 200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  };

  setPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user } = req;

      await authService.setPassword({
        userId: user.id,
        ...req.validated,
      });

      apiResponse(res, null, 200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  };

  addRefreshTokenToCookie = (res: Response, token: string): void => {
    try {
      const refreshExpiresDays = parseInt(process.env.REFRESH_EXPIRES_IN || "14");
      const maxAge = 1000 * 60 * 60 * 24 * refreshExpiresDays;

      res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge,
        path: "/auth/refresh-token",
      });
    } catch (err) {
      logError(
        "Failed to set refresh token cookie: " +
        (err instanceof Error ? err.message : String(err))
      );
    }
  };
}

export default new AuthController();
