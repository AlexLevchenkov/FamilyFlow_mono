import { Router } from "express";
import familyController from "@controllers/family.controller";
import { validateAddFamilyMember } from "@/middleware";

const familyRouter = Router();

familyRouter.get("/", familyController.getFamily);
familyRouter.post("/members", validateAddFamilyMember, familyController.addMember);

export default familyRouter;
