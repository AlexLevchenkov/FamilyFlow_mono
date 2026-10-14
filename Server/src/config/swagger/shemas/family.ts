import type { AddFamilyMemberRequest, FamilyModel } from "@familyflow/contracts";
import { interfaceToOpenAPI } from "@/utils";

const date = new Date().toISOString();

export const familySchemas = {
  FamilyResponse: interfaceToOpenAPI<FamilyModel>({
    id: 1,
    ownerId: 1,
    name: "Наша родина",
    createdAt: date,
    updatedAt: date,
    members: [{
      id: 1,
      userId: 1,
      email: "owner@example.com",
      name: "Family owner",
      avatar: null,
      isOwner: true,
      joinedAt: date,
    }],
  }),
  AddFamilyMemberRequest: interfaceToOpenAPI<AddFamilyMemberRequest>({
    email: "member@example.com",
  }),
};
