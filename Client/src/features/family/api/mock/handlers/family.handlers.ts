import { mockDb } from '@mocks/database';
import { ok, err } from '@mocks/handlers/types';
import type {
  MockRequestContext,
  MockResponseResult,
} from '@mocks/handlers/types';
import type {
  AddFamilyMemberBody,
  CreateFamilyBody,
  DeleteFamilyMemberInput,
  UpdateFamilyMemberRoleBody,
  UpdateFamilyBody,
} from '@types';

export const familyHandlers = {
  getMyFamily(ctx: any): MockResponseResult {
    const family = mockDb.families.getMyFamily(1);
    return ok(family, 200);
  },

  getFamilyById(ctx: MockRequestContext): MockResponseResult {
    const family = mockDb.families.getFamilyById(Number(ctx.params.familyId));

    if (!family) {
      return err('Family not found', 404);
    }

    return ok(family, 200);
  },

  createFamily(ctx: MockRequestContext<CreateFamilyBody>): MockResponseResult {
    const family = mockDb.families.createFamily({
      name: ctx.body?.name || 'test',
    });

    if (!family) {
      return err('Family not created', 400);
    }

    return ok(family, 200);
  },

  updateFamily(ctx: MockRequestContext<UpdateFamilyBody>): MockResponseResult {
    const { familyId, name } = ctx.body || {};

    if (!familyId || !name) {
      return err('Family ID and name are required', 400);
    }

    const family = mockDb.families.updateFamily({
      familyId,
      name,
    });

    if (!family) {
      return err('Family not found', 404);
    }

    return ok(family, 200);
  },

  deleteFamily(ctx: MockRequestContext): MockResponseResult {
    const familyId = Number(ctx.params.familyId);
    mockDb.families.deleteFamily(familyId);
    return ok(undefined, 200);
  },

  getFamilyMembers(ctx: MockRequestContext): MockResponseResult {
    const familyId = Number(ctx.params.familyId);
    const members = mockDb.families.getFamilyMembers(familyId);
    return ok(members, 200);
  },

  addFamilyMember(
    ctx: MockRequestContext<AddFamilyMemberBody>
  ): MockResponseResult {
    const { familyId, targetUserId, role } = ctx.body || {};

    if (!familyId || !targetUserId) {
      return err('Family ID and target user ID are required', 400);
    }

    const member = mockDb.families.addFamilyMember({
      familyId,
      targetUserId,
      role,
    });
    if (!member) {
      return err('Family member not added', 400);
    }
    return ok(member, 200);
  },

  updateFamilyMemberRole(
    ctx: MockRequestContext<UpdateFamilyMemberRoleBody>
  ): MockResponseResult {
    const { familyId, memberId, role } = ctx.body || {};

    if (!familyId || !memberId) {
      return err('Family ID and member ID are required', 400);
    }

    const members = mockDb.families.getFamilyMembers(familyId);

    const thisUser = members.find(member => member.id === memberId);

    if (!thisUser) {
      return err('Member not found', 404);
    }

    const member = mockDb.families.updateFamilyMember({
      familyId,
      memberId,
      role: role || thisUser.role,
    });

    if (!member) {
      return err('Family member not updated', 400);
    }

    return ok(member, 200);
  },

  removeFamilyMember(
    ctx: MockRequestContext<DeleteFamilyMemberInput>
  ): MockResponseResult {
    const { familyId, memberId } = ctx.body || {};

    if (!familyId || !memberId) {
      return err('Family ID and member ID are required', 400);
    }

    mockDb.families.removeFamilyMember({ familyId, memberId });
    return ok(undefined, 200);
  },
};
