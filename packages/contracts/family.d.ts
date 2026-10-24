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

export interface CreateFamilyRequest {
  name: string;
}

export interface UpdateFamilyRequest extends FamilyById {
  name: string;
}

export interface AddFamilyMemberRequest extends FamilyById {
  email?: string;
  targetUserId?: number;
  role?: FamilyRole;
}

export interface UpdateFamilyMemberRoleRequest extends FamilyById {
  memberId: number;
  role: FamilyRole;
}

export interface DeleteFamilyMemberInput extends FamilyById {
  memberId: number;
}
