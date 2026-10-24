import type { Request, Response } from "express";
import apiResponse from "@utils/response";
import familyService from "@services/family.service";
import {
  CreateFamilyRequest,
  FamilyModel,
  FamilyById,
  UpdateFamilyRequest,
  AddFamilyMemberRequest,
  UpdateFamilyMemberRoleRequest,
  DeleteFamilyMemberInput,
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
      const { familyId }: FamilyById = req.validated;
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
      const { name }: CreateFamilyRequest = req.validated;
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
      const { familyId, name }: UpdateFamilyRequest = req.validated;
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
      const { familyId }: FamilyById = req.validated;
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
      const { familyId }: FamilyById = req.validated;
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
      const { familyId, email, targetUserId, role }: AddFamilyMemberRequest =
        req.validated;

      const data = await familyService.addMember({
        userId: user.id,
        familyId,
        email,
        targetUserId,
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
      const { familyId, memberId, role }: UpdateFamilyMemberRoleRequest =
        req.validated;

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
      const { familyId, memberId }: DeleteFamilyMemberInput = req.validated;

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
