import { Router } from "express";
import listController from "@controllers/list.controller";
import {
  validateGetList,
  validateGetUserLists,
  validateCreateList,
  validateUpdateList,
  validateDeleteList,
  validateShareList,
} from "@middleware";

const listRouter = Router();

listRouter.post("/share", validateShareList, listController.shareList);
listRouter.delete("/share", listController.removeSharingList);
listRouter.get("/:id", validateGetList, listController.getListById);
listRouter.get("/", validateGetUserLists, listController.getUserLists);
listRouter.post("/", validateCreateList, listController.createList);
listRouter.put("/:id", validateUpdateList, listController.updateList);
listRouter.delete("/:id", validateDeleteList, listController.deleteList);

export default listRouter;
