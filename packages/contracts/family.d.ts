export type FamilyRole = "OWNER" | "PARENT" | "CHILD" | "MEMBER";

export interface FamilyMemberUser {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
}

export interface FamilyMemberModel {
  id: number;
  userId: number | null;
  familyId: number;
  role: FamilyRole;
  activated?: boolean;
  email?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: FamilyMemberUser | null;
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

export interface AddMemberBody {
  email: string;
  role?: FamilyRole;
}

export interface UpdateMemberRoleBody {
  role: FamilyRole;
}
