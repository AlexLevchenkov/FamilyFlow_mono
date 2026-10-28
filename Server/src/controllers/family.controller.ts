import type { Request, Response } from "express";
import apiResponse from "@utils/response";
import familyService from "@services/family.service";
import {
  CreateFamilyBody,
  FamilyModel,
  FamilyById,
  UpdateFamilyBody,
  AddFamilyMemberBody,
  UpdateFamilyMemberRoleBody,
  FamilyWithMemberId,
} from "@familyflow/contracts";

class FamilyController {
  async getCurrentUserFamily(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const data: FamilyModel = await familyService.getCurrentUserFamily({
        userId: user.id,
      });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode || 500, errorMessage);
    }
  }

  async getFamilyById(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { familyId } = req.validated?.params as FamilyById;
      const data = await familyService.getFamilyById({
        userId: user.id,
        familyId,
      });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode || 500, errorMessage);
    }
  }

  async createFamily(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { name } = req.validated?.body as CreateFamilyBody;
      const data = await familyService.createFamily({
        userId: user.id,
        name,
      });
      apiResponse(res, data, 201);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode || 500, errorMessage);
    }
  }

  async updateFamily(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { name } = req.validated?.body as UpdateFamilyBody;
      const { familyId } = req.validated?.params as FamilyById;
      const data = await familyService.updateFamily({
        userId: user.id,
        familyId,
        name,
      });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode || 500, errorMessage);
    }
  }

  async deleteFamily(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { familyId } = req.validated?.params as FamilyById;
      const data = await familyService.deleteFamily({
        userId: user.id,
        familyId,
      });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode || 500, errorMessage);
    }
  }

  async getMembers(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { familyId } = req.validated?.params as FamilyById;
      const data = await familyService.getMembers({
        userId: user.id,
        familyId,
      });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode || 500, errorMessage);
    }
  }

  async addMember(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { familyId } = req.validated?.params as FamilyById;
      const { email, role } = req.validated?.body as AddFamilyMemberBody;

      const data = await familyService.addMember({
        userId: user.id,
        familyId,
        email,
        role,
      });
      apiResponse(res, data, 201);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode || 500, errorMessage);
    }
  }

  async updateMemberRole(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { familyId, memberId } = req.validated
        ?.params as FamilyWithMemberId;
      const { role } = req.validated?.body as UpdateFamilyMemberRoleBody;

      const data = await familyService.updateMemberRole({
        userId: user.id,
        familyId,
        memberId,
        role,
      });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode || 500, errorMessage);
    }
  }

  async removeMember(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { familyId, memberId } = req.validated
        ?.params as FamilyWithMemberId;

      const data = await familyService.removeMember({
        userId: user.id,
        familyId,
        memberId,
      });
      apiResponse(res, data, 200);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      apiResponse(res, null, error.statusCode || 500, errorMessage);
    }
  }
}

const familyController = new FamilyController();
export default familyController;
