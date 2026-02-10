import { Router } from "express";
import authController from "@controllers/auth.controller";
import authenticate from "@middleware/authenticate";
import cookieExtractor from "@middleware/cookieExtractor";
import {
  validateChangePassword,
  validateLogin,
  validateLogout,
  validateSetPassword,
} from "@middleware/schemas/auth";

const authRouter = Router();

authRouter.post("/login", validateLogin, authController.login);
authRouter.post("/logout", authenticate, validateLogout, authController.logout);
authRouter.post(
  "/refresh-token",
  authenticate,
  cookieExtractor,
  authController.refreshToken
);
authRouter.post(
  "/change-password",
  authenticate,
  validateChangePassword,
  authController.changePassword
);
authRouter.post(
  "/set-password",
  authenticate,
  validateSetPassword,
  authController.setPassword
);

export default authRouter;
