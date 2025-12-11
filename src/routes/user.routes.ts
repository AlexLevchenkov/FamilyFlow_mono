import { Router } from "express";
import { validateDeleteUser, validateGetUser, validateGetUsers, validateRegister, validateUpdateUser } from "@middleware/user";
import userController from "@controllers/user.controller";

const userRouter = Router();

userRouter.get('/:id', validateGetUser, userController.getUserById);
userRouter.get('/', validateGetUsers, userController.getUsers);
userRouter.post('/', validateRegister, userController.register);
userRouter.put('/', validateUpdateUser, userController.updateUser);
userRouter.delete('/', validateDeleteUser, userController.deleteUser);

export default userRouter;
