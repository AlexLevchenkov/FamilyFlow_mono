import { Router } from "express";
import familyController from "@controllers/family.controller";
import {
  validateCreateFamily,
  validateGetFamilyById,
  validateUpdateFamily,
  validateDeleteFamily,
  validateAddFamilyMember,
  validateUpdateFamilyMemberRole,
  validateDeleteFamilyMember,
} from "@middleware";

const familyRouter = Router();

familyRouter.get("/my", familyController.getCurrentUserFamily);
familyRouter.post("/", validateCreateFamily, familyController.createFamily);
familyRouter.get("/:id", validateGetFamilyById, familyController.getFamilyById);
familyRouter.put("/:id", validateUpdateFamily, familyController.updateFamily);
familyRouter.delete("/:id", validateDeleteFamily, familyController.deleteFamily);

familyRouter.get(
  "/:id/members",
  validateGetFamilyById,
  familyController.getMembers
);
familyRouter.post(
  "/:id/members",
  validateAddFamilyMember,
  familyController.addMember
);
familyRouter.put(
  "/:id/members/:memberId",
  validateUpdateFamilyMemberRole,
  familyController.updateMemberRole
);
familyRouter.delete(
  "/:id/members/:memberId",
  validateDeleteFamilyMember,
  familyController.removeMember
);

export default familyRouter;
