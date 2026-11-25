import { Express } from "express";
import authRouter from "./auth.routes";
import eventRouter from "./event.routes";
import familyRouter from "./family.routes";
import goalRouter from "./goal.routes";
import searchRouter from "./search.routes";
import taskRouter from "./task.routes";
import userRouter from "./user.routes";
import { authenticate } from "@middleware";

function setupRoutes(app: Express): void {
  app.use("/auth", authRouter);
  app.use("/event", authenticate, eventRouter);
  app.use("/family", authenticate, familyRouter);
  app.use("/goal", authenticate, goalRouter);
  app.use("/search", authenticate, searchRouter);
  app.use("/task", authenticate, taskRouter);
  app.use("/user", userRouter);
}

export default setupRoutes;
