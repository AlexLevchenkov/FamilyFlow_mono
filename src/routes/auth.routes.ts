import { Router } from "express";import authController from "@controllers/auth.controller";
import { validateChangePassword, validateLogin, validateLogout } from "@middleware/validation";
import cookieExtractor from "@middleware/cookieExtractor";

const authRouter = Router();

authRouter.post("/login", validateLogin, authController.login);
authRouter.post("/logout", validateLogout, authController.logout);
authRouter.post("/refresh-token", cookieExtractor, authController.refreshToken);
authRouter.post(
  "/change-password",
  validateChangePassword,
  authController.changePassword
);
authRouter.post("/set-password", authController.setPassword);

export default authRouter;
