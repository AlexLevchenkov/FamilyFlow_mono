import { INITIAL_USERS } from '@features/user/store/mockUser';
import type {
  AddMemberBody,
  CreateFamilyBody,
  FamilyMemberModel,
  FamilyModel,
  UpdateMemberRoleBody,
  UpdateFamilyBody,
  FamilyById,
  FamilyWithMemberId,
  WithUserId,
} from '@types';

export const INITIAL_FAMILY: FamilyModel[] = [
  {
    id: 1,
    name: "Сім'я Коваль",
    createdAt: new Date('2026-01-10T10:00:00.000Z'),
    updatedAt: new Date('2026-01-10T10:00:00.000Z'),
    members: [
      {
        id: 1,
        userId: 1,
        familyId: 1,
        role: 'OWNER',
        createdAt: new Date('2026-01-10T10:00:00.000Z'),
        updatedAt: new Date('2026-01-10T10:00:00.000Z'),
        user: INITIAL_USERS[0],
      },
      {
        id: 2,
        userId: 2,
        familyId: 1,
        role: 'PARENT',
        createdAt: new Date('2026-01-10T10:00:00.000Z'),
        updatedAt: new Date('2026-01-10T10:00:00.000Z'),
        user: INITIAL_USERS[1],
      },
      {
        id: 3,
        userId: 3,
        familyId: 1,
        role: 'CHILD',
        createdAt: new Date('2026-01-10T10:00:00.000Z'),
        updatedAt: new Date('2026-01-10T10:00:00.000Z'),
        user: INITIAL_USERS[2],
      },
      {
        id: 4,
        userId: 4,
        familyId: 1,
        role: 'MEMBER',
        createdAt: new Date('2026-01-10T10:00:00.000Z'),
        updatedAt: new Date('2026-01-10T10:00:00.000Z'),
        user: INITIAL_USERS[3],
      },
    ],
  },
];

export class MockFamilyDatabase {
  private families: FamilyModel[] = [];
  private nextFamilyId: number = 1;

  constructor() {
    this.reset();
  }

  public reset() {
    this.families = [...INITIAL_FAMILY];
    this.nextFamilyId = INITIAL_FAMILY.length + 1;
  }

  public getMyFamily(userId: number) {
    return this.families.find(family => {
      if (family.members?.length) {
        return family.members.some(member => member.userId === userId);
      }
    });
  }

  public getFamilyById(id: number) {
    return this.families.find(family => family.id === id);
  }

  public createFamily(family: CreateFamilyBody) {
    const newFamily: FamilyModel = {
      id: this.nextFamilyId++,
      name: family.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.families.push(newFamily);
    return newFamily;
  }

  public updateFamily({ familyId, name }: UpdateFamilyBody & FamilyById) {
    const family = this.getFamilyById(familyId);
    if (!family) return;
    const updatedFamily: FamilyModel = {
      ...family,
      name,
      updatedAt: new Date(),
    };
    this.families = this.families.map(family =>
      family.id === familyId ? updatedFamily : family
    );

    return updatedFamily;
  }

  public deleteFamily(id: number) {
    this.families = this.families.filter(family => family.id !== id);
  }

  public getMembers(familyId: number) {
    const family = this.getFamilyById(familyId);
    return family?.members || [];
  }

  public addMember({
    familyId,
    userId,
    role,
  }: WithUserId<AddMemberBody> & FamilyById) {
    const family = this.getFamilyById(familyId);
    if (!family || !userId) return;

    if (!family.members) {
      family.members = [];
    }

    const newMember: FamilyMemberModel = {
      id: family.members.length + 1,
      userId,
      familyId,
      role: role || 'MEMBER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    family.members.push(newMember);

    return newMember;
  }

  public updateMember({
    familyId,
    memberId,
    role,
  }: UpdateMemberRoleBody & FamilyWithMemberId) {
    const family = this.getFamilyById(familyId);
    if (!family) return;
    const member = family.members?.find(member => member.id === memberId);
    if (!member) return;
    member.role = role;
    member.updatedAt = new Date();

    return member;
  }

  public removeMember({ familyId, memberId }: FamilyWithMemberId) {
    const family = this.getFamilyById(familyId);
    if (!family || !family.members) return;
    family.members = family.members.filter(member => member.id !== memberId);
  }
}
