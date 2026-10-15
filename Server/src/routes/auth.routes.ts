import { Router } from "express";
import authController from "@controllers/auth.controller";
import {
  authenticate,
  cookieExtractor,
  validateLogin,
  validateLogout,
  validateRequestPasswordReset,
  validateResetPassword,
  validateVerifyEmail,
} from "@/middleware";

const authRouter = Router();

authRouter.post("/login", validateLogin, authController.login);
authRouter.get("/logout", authenticate, validateLogout, authController.logout);
authRouter.post("/refresh-token", cookieExtractor, authController.refreshToken);
authRouter.post(
  "/forgot-password",
  validateRequestPasswordReset,
  authController.requestPasswordReset
);
authRouter.post(
  "/reset-password",
  validateResetPassword,
  authController.resetPassword
);
authRouter.get(
  "/verify-email",
  validateVerifyEmail,
  authController.verifyEmail
);

export default authRouter;
