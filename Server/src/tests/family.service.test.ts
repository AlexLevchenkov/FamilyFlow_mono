import familyService from "@services/family.service";
import prisma from "@config/prisma";
import { AppError } from "@utils/errors";

jest.mock("@config/prisma", () => ({
  family: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  familyMember: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
}));

describe("FamilyService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCurrentUserFamily", () => {
    it("should return the family of the user", async () => {
      const mockFamily = {
        id: 1,
        name: "Test Family",
        FamilyMember: [{ id: 1, userId: 10, role: "OWNER" }],
      };

      (prisma.familyMember.findFirst as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 10,
        family: mockFamily,
      });

      const result = await familyService.getCurrentUserFamily({ userId: 10 });
      expect(result).toEqual(mockFamily);
    });

    it("should throw notFoundError if user has no family", async () => {
      (prisma.familyMember.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        familyService.getCurrentUserFamily({ userId: 10 })
      ).rejects.toThrow("User does not belong to any family");
    });
  });

  describe("createFamily", () => {
    it("should throw alreadyExistError if user is already in a family", async () => {
      (prisma.familyMember.findFirst as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 10,
        familyId: 1,
      });

      await expect(
        familyService.createFamily({ userId: 10, name: "New Family" })
      ).rejects.toThrow(
        "You already belong to a family. Leave or delete your current family first."
      );
    });

    it("should create family with creator as OWNER in transaction", async () => {
      (prisma.familyMember.findFirst as jest.Mock).mockResolvedValue(null);

      const createdFamily = {
        id: 5,
        name: "New Family",
        FamilyMember: [{ id: 1, userId: 10, role: "OWNER" }],
      };

      (prisma.$transaction as jest.Mock).mockImplementation(async callback => {
        const tx = {
          family: {
            create: jest.fn().mockResolvedValue({ id: 5, name: "New Family" }),
            findUnique: jest.fn().mockResolvedValue(createdFamily),
          },
          familyMember: {
            create: jest.fn().mockResolvedValue({
              id: 1,
              familyId: 5,
              userId: 10,
              role: "OWNER",
            }),
          },
        };
        return callback(tx);
      });

      const result = await familyService.createFamily({
        userId: 10,
        name: "New Family",
      });
      expect(result).toEqual(createdFamily);
    });
  });

  describe("addMember", () => {
    it("should throw forbiddenError if current user is not OWNER or PARENT", async () => {
      (prisma.familyMember.findUnique as jest.Mock).mockResolvedValue({
        userId: 10,
        familyId: 1,
        role: "MEMBER",
      });

      await expect(
        familyService.addMember({
          currentUserId: 10,
          familyId: 1,
          email: "child@test.com",
        })
      ).rejects.toThrow("Only OWNER or PARENT can add members to the family");
    });

    it("should successfully add a member by email", async () => {
      (prisma.familyMember.findUnique as jest.Mock)
        .mockResolvedValueOnce({
          userId: 10,
          familyId: 1,
          role: "OWNER",
        }) // current member
        .mockResolvedValueOnce(null); // target user in family

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 20,
        email: "member@test.com",
        name: "Member",
      });

      (prisma.familyMember.findFirst as jest.Mock).mockResolvedValue(null); // not in any family

      const newMember = {
        id: 2,
        familyId: 1,
        userId: 20,
        role: "CHILD",
        user: { id: 20, name: "Member", email: "member@test.com" },
      };
      (prisma.familyMember.create as jest.Mock).mockResolvedValue(newMember);

      const result = await familyService.addMember({
        currentUserId: 10,
        familyId: 1,
        email: "member@test.com",
        role: "CHILD",
      });

      expect(result).toEqual(newMember);
      expect(prisma.familyMember.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            familyId: 1,
            userId: 20,
            role: "CHILD",
          },
        })
      );
    });
  });

  describe("updateMemberRole", () => {
    it("should prevent non-OWNER from modifying OWNER role", async () => {
      (prisma.familyMember.findUnique as jest.Mock)
        .mockResolvedValueOnce({
          userId: 10,
          familyId: 1,
          role: "PARENT",
        }) // current user
        .mockResolvedValueOnce({
          userId: 20,
          familyId: 1,
          role: "OWNER",
        }); // target member

      await expect(
        familyService.updateMemberRole({
          currentUserId: 10,
          familyId: 1,
          targetUserId: 20,
          role: "MEMBER",
        })
      ).rejects.toThrow("Only OWNER can modify or assign OWNER role");
    });

    it("should allow OWNER to update another member's role", async () => {
      (prisma.familyMember.findUnique as jest.Mock)
        .mockResolvedValueOnce({
          userId: 10,
          familyId: 1,
          role: "OWNER",
        }) // current user
        .mockResolvedValueOnce({
          userId: 20,
          familyId: 1,
          role: "MEMBER",
        }); // target user

      const updated = {
        id: 2,
        familyId: 1,
        userId: 20,
        role: "PARENT",
      };
      (prisma.familyMember.update as jest.Mock).mockResolvedValue(updated);

      const result = await familyService.updateMemberRole({
        currentUserId: 10,
        familyId: 1,
        targetUserId: 20,
        role: "PARENT",
      });

      expect(result).toEqual(updated);
    });
  });

  describe("removeMember", () => {
    it("should allow a member to leave the family", async () => {
      (prisma.familyMember.findUnique as jest.Mock)
        .mockResolvedValueOnce({
          userId: 20,
          familyId: 1,
          role: "MEMBER",
        }) // current
        .mockResolvedValueOnce({
          userId: 20,
          familyId: 1,
          role: "MEMBER",
        }); // target

      (prisma.familyMember.delete as jest.Mock).mockResolvedValue({});

      const result = await familyService.removeMember({
        currentUserId: 20,
        familyId: 1,
        targetUserId: 20,
      });

      expect(result).toEqual({ message: "Left family successfully" });
    });

    it("should prevent the only OWNER from leaving without transferring ownership", async () => {
      (prisma.familyMember.findUnique as jest.Mock)
        .mockResolvedValueOnce({
          userId: 10,
          familyId: 1,
          role: "OWNER",
        })
        .mockResolvedValueOnce({
          userId: 10,
          familyId: 1,
          role: "OWNER",
        });

      (prisma.familyMember.count as jest.Mock).mockResolvedValue(0);

      await expect(
        familyService.removeMember({
          currentUserId: 10,
          familyId: 1,
          targetUserId: 10,
        })
      ).rejects.toThrow(
        "The only OWNER cannot leave the family. Assign another OWNER or delete the family."
      );
    });
  });
});
