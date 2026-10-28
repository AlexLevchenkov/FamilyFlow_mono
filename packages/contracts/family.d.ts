export type FamilyRole = "OWNER" | "PARENT" | "CHILD" | "MEMBER";

export interface FamilyMemberUser {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
}

export interface FamilyMemberModel {
  id: number;
  userId: number;
  familyId: number;
  role: FamilyRole;
  createdAt: Date;
  updatedAt: Date;
  user?: FamilyMemberUser;
}

export interface FamilyModel {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  members?: FamilyMemberModel[];
}

export interface FamilyById {
  familyId: number;
}

export interface FamilyWithMemberId extends FamilyById {
  memberId: number;
}

export interface CreateFamilyBody {
  name: string;
}

export interface UpdateFamilyBody {
  name: string;
}

export interface AddFamilyMemberBody {
  email: string;
  role?: FamilyRole;
}

export interface UpdateFamilyMemberRoleBody {
  role: FamilyRole;
}
