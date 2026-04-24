import { Router } from "express";
import authController from "@controllers/auth.controller";
import authenticate from "@middleware/authenticate";
import cookieExtractor from "@middleware/cookieExtractor";
import {
  validateChangePassword,
  validateLogin,
  validateLogout,
  validateRequestPasswordReset,
  validateResetPassword,
  validateSetPassword,
  validateVerifyEmail,
} from "@middleware/schemas/auth";

const authRouter = Router();

authRouter.post("/login", validateLogin, authController.login);
authRouter.get("/logout", authenticate, validateLogout, authController.logout);
authRouter.post("/refresh-token", cookieExtractor, authController.refreshToken);
authRouter.post("/change-password", authenticate, validateChangePassword, authController.changePassword); // TODO Не впевнений що це все ще буде потрібно
authRouter.post("/set-password", authenticate, validateSetPassword, authController.setPassword); // TODO Не впевнений що це все ще буде потрібно
authRouter.post("/forgot-password", validateRequestPasswordReset, authController.requestPasswordReset);
authRouter.post("/reset-password", validateResetPassword, authController.resetPassword);
authRouter.get("/verify-email", validateVerifyEmail, authController.verifyEmail);

export default authRouter;
