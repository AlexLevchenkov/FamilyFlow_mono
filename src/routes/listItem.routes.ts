import { Router } from "express";
import {
  validateCreateItem,
  validateDeleteItem,
  validateGetListItem,
  validateGetListItems,
  validateUpdateItem,
} from "@middleware/schemas/item";
import itemController from "@controllers/item.controller";

const itemListRouter = Router();

itemListRouter.get("/:id", validateGetListItem, itemController.getListItemById);
itemListRouter.get("/", validateGetListItems, itemController.getListItems);
itemListRouter.post("/", validateCreateItem, itemController.createListItem);
itemListRouter.put("/:id", validateUpdateItem, itemController.updateListItem);
itemListRouter.delete("/:id", validateDeleteItem, itemController.deleteListItem);

export default itemListRouter;
