import { Router } from "express";
import searchController from "@controllers/search.controller";
import { validateGlobalSearch } from "@middleware";

const searchRouter = Router();

searchRouter.get("/", validateGlobalSearch, searchController.search);

export default searchRouter;
