import { Router } from "express";
import authController from "@controllers/auth.controller";
import authenticate from "@middleware/authenticate";
import cookieExtractor from "@middleware/cookieExtractor";
import platformIdentifier from "@middleware/platformIdentifier";
import {
  validateChangePassword,
  validateLogin,
  validateLogout,
  validateSetPassword,
} from "@middleware/schemas/auth";

const authRouter = Router();

authRouter.post("/login", platformIdentifier, validateLogin, authController.login);
authRouter.post("/logout", platformIdentifier, authenticate, validateLogout, authController.logout);
authRouter.post(
  "/refresh-token",
  platformIdentifier, 
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
