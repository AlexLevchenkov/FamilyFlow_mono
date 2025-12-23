import { Express } from "express";
import authRouter from "@routes/auth.routes";
import listRouter from "@routes/list.routes";
import userRouter from "@routes/user.routes";
import authenticate from "@middleware/authenticate";

function setupRoutes(app: Express): void {
  app.use("/auth", authRouter);
  app.use("/list", authenticate, listRouter);
  app.use("/user", userRouter);
}

export default setupRoutes;
