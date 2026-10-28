import type {
  CreateFamilyBody,
  UpdateFamilyBody,
  AddFamilyMemberBody,
  UpdateFamilyMemberRoleBody,
  FamilyModel,
  FamilyMemberModel,
} from "@familyflow/contracts";
import { interfaceToOpenAPI } from "@utils";

const now = new Date();

const ownerMember: FamilyMemberModel = {
  id: 1,
  userId: 1,
  familyId: 1,
  role: "OWNER",
  createdAt: now,
  updatedAt: now,
  user: {
    id: 1,
    email: "seed.owner@familyflow.test",
    name: "Seed Owner",
    avatar: "https://example.com/avatars/seed-owner.png",
  },
};

const parentMember: FamilyMemberModel = {
  id: 2,
  userId: 2,
  familyId: 1,
  role: "PARENT",
  createdAt: now,
  updatedAt: now,
  user: {
    id: 2,
    email: "seed.parent@familyflow.test",
    name: "Seed Parent",
    avatar: null,
  },
};

const childMember: FamilyMemberModel = {
  id: 3,
  userId: 3,
  familyId: 1,
  role: "CHILD",
  createdAt: now,
  updatedAt: now,
  user: {
    id: 3,
    email: "seed.child@familyflow.test",
    name: "Seed Child",
    avatar: null,
  },
};

const member: FamilyMemberModel = {
  id: 4,
  userId: 4,
  familyId: 1,
  role: "MEMBER",
  createdAt: now,
  updatedAt: now,
  user: {
    id: 4,
    email: "seed.member@familyflow.test",
    name: "Seed Member",
    avatar: null,
  },
};

const familySample: FamilyModel = {
  id: 1,
  name: "Seed Family",
  createdAt: now,
  updatedAt: now,
  members: [ownerMember, parentMember, childMember, member],
};

export const familySchemas = {
  FamilyResponse: interfaceToOpenAPI<FamilyModel>(familySample),
  FamilyMemberResponse: interfaceToOpenAPI<FamilyMemberModel>(parentMember),
  CreateFamilyBody: interfaceToOpenAPI<CreateFamilyBody>({
    name: familySample.name,
  }),
  UpdateFamilyBody: interfaceToOpenAPI<UpdateFamilyBody>({
    name: familySample.name,
  }),
  AddFamilyMemberBody: interfaceToOpenAPI<AddFamilyMemberBody>({
    email: childMember.user!.email,
    role: childMember.role,
  }),
  UpdateFamilyMemberRoleBody: interfaceToOpenAPI<UpdateFamilyMemberRoleBody>({
    role: childMember.role,
  }),
};
