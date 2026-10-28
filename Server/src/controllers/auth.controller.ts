import { Request, Response } from "express";
import authService from "@services/auth.service";
import { logError } from "@utils/logger";
import apiResponse from "@utils/response";
import {
  ForgotPasswordBody,
  LoginBody,
  LoginDataResponse,
} from "@familyflow/contracts";

class AuthController {
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password }: LoginBody = req.validated?.body;
      const data: LoginDataResponse = await authService.login({
        email,
        password,
      });
      this._addRefreshTokenToCookie(res, data.refreshToken);
      apiResponse(
        res,
        {
          user: { name: data.user.name, avatar: data.user.avatar },
          accessToken: data.accessToken,
        },
        200
      );
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user } = req;

      await authService.logout({ userId: user.id, jti: user.jti! });

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

      apiResponse(res, null, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user } = req;
      const data = await authService.refreshToken({
        userId: user.id,
        jti: user.jti!,
      });
      this._addRefreshTokenToCookie(res, data.refreshToken);
      apiResponse(res, { accessToken: data.accessToken }, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  };

  requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email }: ForgotPasswordBody = req.validated?.body;
      await authService.requestPasswordReset({ email });
      apiResponse(res, null, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword } = req.validated?.body;
      await authService.resetPassword({ token, newPassword });
      apiResponse(res, null, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.validated?.body;
      await authService.verifyEmail({ token });
      apiResponse(res, null, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  };

  _addRefreshTokenToCookie = (res: Response, token: string): void => {
    try {
      const refreshExpiresDays = parseInt(
        process.env.REFRESH_EXPIRES_IN || "14"
      );
      const maxAge = 1000 * 60 * 60 * 24 * refreshExpiresDays;

      res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge,
        path: "/auth/refresh-token",
      });
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode, errorMessage);
    }
  };
}

export default new AuthController();
