import { Request, Response } from "express";
import authService from "@services/auth.service";
import { ChangePasswordInput, LoginInput } from "@middleware/schemas/auth";
import { RequestTU } from "@middleware/cookieExtractor";
import { logError } from "@utils/logger";
import apiResponse from "@utils/response";

class AuthController {
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body as LoginInput;
      const data = await authService.login({ email, password });

      this.addRefreshTokenToCookie(res, data.refreshToken);

      apiResponse(res, { ...data, user: {...data.user, password: null} }, 200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  };

  logout = async (req: RequestTU, res: Response): Promise<void> => {
    try {
      const { user } = req;

      if (!user) {
        apiResponse(res, null, 400, "Could not get user");
        return;
      }

      await authService.logout({ userId: user.id });

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

      apiResponse(res, null, 200, "Logged out successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  };

  refreshToken = async (req: RequestTU, res: Response): Promise<void> => {
    try {
      const { user } = req;

      if (!user || !user.id || !user.jti) {
        apiResponse(res, null, 400, "Could not get user or jti");
        return;
      }

      const data = await authService.refreshToken({
        userId: user.id,
        jti: user.jti,
      });

      this.addRefreshTokenToCookie(res, data.refreshToken);

      apiResponse(res, data, 200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  };

  changePassword = async (req: RequestTU, res: Response): Promise<void> => {
    try {
      const { user } = req;
      const { currentPassword, password } = req.body as ChangePasswordInput;

      if (!user) {
        apiResponse(res, null, 400, "Could not get user");
        return;
      }

      await authService.changePassword({
        userId: user?.id,
        currentPassword,
        password,
      });

      apiResponse(res, null, 200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  };

  setPassword = async (req: RequestTU, res: Response): Promise<void> => {
    try {
      const { user } = req;
      const { password } = req.body as ChangePasswordInput;

      if (!user) {
        apiResponse(res, null, 400, "Could not get user");
        return;
      }

      await authService.setPassword({
        userId: user?.id,
        password,
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
