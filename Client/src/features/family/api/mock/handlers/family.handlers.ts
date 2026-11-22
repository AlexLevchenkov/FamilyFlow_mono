import { mockDb, ok, err } from '@mocks';
import type { MockRequestContext, MockResponseResult } from '@mocks';
import type {
  AddMemberBody,
  CreateFamilyBody,
  UpdateMemberRoleBody,
  UpdateFamilyBody,
  FamilyWithMemberId,
} from '@types';

export const familyHandlers = {
  getMyFamily(): MockResponseResult {
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
    const { name } = ctx.body || {};
    const familyId = Number(ctx.params.familyId);

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

  getMembers(ctx: MockRequestContext): MockResponseResult {
    const familyId = Number(ctx.params.familyId);
    const members = mockDb.families.getMembers(familyId);
    return ok(members, 200);
  },

  addMember(ctx: MockRequestContext<AddMemberBody>): MockResponseResult {
    const { email, role } = ctx.body || {};
    const familyId = Number(ctx.params.familyId);

    if (!familyId) {
      return err('Family ID and target user ID are required', 400);
    }

    if (!email || !role) {
      return err('No email or role', 400);
    }

    const member = mockDb.families.addMember({
      familyId,
      userId: 1,
      email,
      role,
    });
    if (!member) {
      return err('Family member not added', 400);
    }
    return ok(member, 200);
  },

  updateMemberRole(
    ctx: MockRequestContext<UpdateMemberRoleBody>
  ): MockResponseResult {
    const familyId = Number(ctx.params.familyId);
    const memberId = Number(ctx.params.memberId);
    const { role } = ctx.body || {};

    if (!familyId || !memberId) {
      return err('Family ID and member ID are required', 400);
    }

    const members = mockDb.families.getMembers(familyId);

    const thisUser = members.find(member => member.id === memberId);

    if (!thisUser) {
      return err('Member not found', 404);
    }

    const member = mockDb.families.updateMember({
      familyId,
      memberId,
      role: role || thisUser.role,
    });

    if (!member) {
      return err('Family member not updated', 400);
    }

    return ok(member, 200);
  },

  removeMember(
    ctx: MockRequestContext<FamilyWithMemberId>
  ): MockResponseResult {
    const { familyId, memberId } = ctx.body || {};

    if (!familyId || !memberId) {
      return err('Family ID and member ID are required', 400);
    }

    mockDb.families.removeMember({ familyId, memberId });
    return ok(undefined, 200);
  },
};
