import { Request, Response } from "express";
import authService from "@services/auth.service";
import { ChangePasswordInput, LoginInput, LogoutInput } from "@middleware/schemas/auth";
import { RequestTU } from "@middleware/cookieExtractor";
import { logError } from "@utils/logger";
import apiResponse from "@utils/response";

class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as LoginInput;
      const data = await authService.login({ email, password });

      if (!data) {
        apiResponse(res, null, 401, "Invalid credentials");
        return;
      }

      try {
        const refreshExpiresDays = parseInt(process.env.REFRESH_EXPIRES_IN || "30") || 30;
        const maxAge = refreshExpiresDays * 24 * 60 * 60 * 1000;

        res.cookie("refreshToken", data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge,
          path: "/",
        });
      } catch (err) {
        logError(
          "Failed to set refresh token cookie: " +
            (err instanceof Error ? err.message : String(err))
        );
      }

      apiResponse(res, { user: data.user, accessToken: data.accessToken }, 200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  }

  async logout(req: RequestTU, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { deviceId } = req.body as LogoutInput;

      if (!user) {
        apiResponse(res, null, 400, "Could not get user");
        return;
      }

      const result = await authService.logout({ userId: user.id, deviceId });

      if (!result) {
        apiResponse(res, null, 400, "Logout failed");
        return;
      }
      try {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
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
  }

  async refreshToken(req: RequestTU, res: Response): Promise<void> {
    try {
      const { user, refreshToken } = req;

      if (!user || !user.id || !refreshToken) {
        apiResponse(res, null, 400, "Could not get user or RefreshToken");
        return;
      }

      const data = await authService.refreshToken({
        userId: user.id,
        refreshToken,
      });

      if (!data) {
        apiResponse(res, null, 400, "Failed to refresh token");
        return;
      }

      try {
        const refreshExpiresDays = parseInt(process.env.REFRESH_EXPIRES_IN || "30") || 30;
        const maxAge = refreshExpiresDays * 24 * 60 * 60 * 1000;

        res.cookie("refreshToken", data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge,
          path: "/",
        });
      } catch (err) {
        logError(
          "Failed to set refresh token cookie: " +
            (err instanceof Error ? err.message : String(err))
        );
      }

      apiResponse(res, data, 200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  }

  async changePassword(req: RequestTU, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { oldPassword, newPassword } = req.body as ChangePasswordInput;

      if (!user) {
        apiResponse(res, null, 400, "Could not get user");
        return;
      }

      const result = await authService.changePassword({
        userId: user?.id,
        oldPassword,
        newPassword,
      });

      if (!result) {
        apiResponse(res, null, 400, "Failed to change password");
        return;
      }

      apiResponse(res, null, 200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  }

  async setPassword(req: RequestTU, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { newPassword } = req.body as ChangePasswordInput;

      if (!user) {
        apiResponse(res, null, 400, "Could not get user");
        return;
      }

      const result = await authService.setPassword({
        userId: user?.id,
        newPassword,
      });

      if (!result) {
        apiResponse(res, null, 400, "Failed to change password");
        return;
      }

      apiResponse(res, null, 200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, 500, errorMessage);
    }
  }
}

export default new AuthController();
