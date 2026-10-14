import type { Request, Response } from "express";
import type { AddFamilyMemberInput } from "@/middleware";
import apiResponse from "@utils/response";
import familyService from "@services/family.service";

function reportError(res: Response, error: unknown) {
  const message = error instanceof Error ? error.message : "An error occurred";
  const statusCode =
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
      ? error.statusCode
      : 500;
  apiResponse(res, null, statusCode, message);
}

class FamilyController {
  async getFamily(req: Request, res: Response): Promise<void> {
    try {
      const family = await familyService.getFamily(req.user.id);
      apiResponse(res, family, 200);
    } catch (error) {
      reportError(res, error);
    }
  }

  async addMember(req: Request, res: Response): Promise<void> {
    try {
      const member = await familyService.addMember(
        req.user.id,
        req.validated as AddFamilyMemberInput
      );
      apiResponse(res, member, 201);
    } catch (error) {
      reportError(res, error);
    }
  }
}

export default new FamilyController();
