import { Router } from "express";
import goalController from "@controllers/goal.controller";
import {
  validateCreateGoal,
  validateGoalId,
  validateUpdateGoal,
} from "@/middleware";

const goalRouter = Router();

goalRouter.get("/", goalController.getGoals);
goalRouter.post("/", validateCreateGoal, goalController.createGoal);
goalRouter.put("/:id", validateUpdateGoal, goalController.updateGoal);
goalRouter.delete("/:id", validateGoalId, goalController.deleteGoal);

export default goalRouter;
