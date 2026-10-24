import { Router } from "express";
import goalController from "@controllers/goal.controller";
import {
  validateGetGoal,
  validateGetUserGoals,
  validateCreateGoal,
  validateUpdateGoal,
  validateDeleteGoal,
} from "@middleware";

const goalRouter = Router();

goalRouter.get("/:id", validateGetGoal, goalController.getGoalById);
goalRouter.get("/", validateGetUserGoals, goalController.getUserGoals);
goalRouter.post("/", validateCreateGoal, goalController.createGoal);
goalRouter.put("/:id", validateUpdateGoal, goalController.updateGoal);
goalRouter.delete("/:id", validateDeleteGoal, goalController.deleteGoal);

export default goalRouter;
