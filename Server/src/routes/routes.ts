import { Express } from "express";
import authRouter from "./auth.routes";
import taskRouter from "./task.routes";
import eventRouter from "./event.routes";
import goalRouter from "./goal.routes";
import userRouter from "./user.routes";
import familyRouter from "./family.routes";
import { authenticate } from "@middleware";

function setupRoutes(app: Express): void {
  app.use("/auth", authRouter);
  app.use("/event", authenticate, eventRouter);
  app.use("/goal", authenticate, goalRouter);
  app.use("/task", authenticate, taskRouter);
  app.use("/user", userRouter);
  app.use("/family", authenticate, familyRouter);
}

export default setupRoutes;
