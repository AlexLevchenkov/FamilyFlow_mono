import { Router } from "express";
import {
  authenticate,
  validateDeleteUser,
  validateGetUser,
  validateGetUsers,
  validateRegister,
  validateUpdateUser,
} from "@/middleware";
import userController from "@controllers/user.controller";

const userRouter = Router();

userRouter.get(
  "/:id",
  authenticate,
  validateGetUser,
  userController.getUserById
);
userRouter.get("/", authenticate, validateGetUsers, userController.getUsers);
userRouter.post("/", validateRegister, userController.register);
userRouter.put(
  "/",
  authenticate,
  validateUpdateUser,
  userController.updateUser
);
userRouter.delete(
  "/",
  authenticate,
  validateDeleteUser,
  userController.deleteUser
);

export default userRouter;
