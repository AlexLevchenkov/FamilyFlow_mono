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
familyRouter.get(
  "/:familyId",
  validateGetFamilyById,
  familyController.getFamilyById
);
familyRouter.put(
  "/:familyId",
  validateUpdateFamily,
  familyController.updateFamily
);
familyRouter.delete(
  "/:familyId",
  validateDeleteFamily,
  familyController.deleteFamily
);

familyRouter.get(
  "/:familyId/members",
  validateGetFamilyById,
  familyController.getMembers
);
familyRouter.post(
  "/:familyId/members",
  validateAddFamilyMember,
  familyController.addMember
);
familyRouter.put(
  "/:familyId/members/:memberId",
  validateUpdateFamilyMemberRole,
  familyController.updateMemberRole
);
familyRouter.delete(
  "/:familyId/members/:memberId",
  validateDeleteFamilyMember,
  familyController.removeMember
);

export default familyRouter;
