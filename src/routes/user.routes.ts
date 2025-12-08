import { Router } from "express";
import { validateDeleteUser, validateRegister, validateUpdateUser } from "@middleware/validation";
import userController from "@controllers/user.controller";

const userRouter = Router();

userRouter.get('/:id', userController.getUserById);
userRouter.get('/', userController.getUsers);
userRouter.post('/', validateRegister, userController.register);
userRouter.put('/', validateUpdateUser, userController.updateUser);
userRouter.delete('/', validateDeleteUser, userController.deleteUser);

export default userRouter;
