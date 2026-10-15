import prisma from "@config/prisma";
import listService from "@/services/list.service";
import bcryptjs from "bcryptjs";

async function createUser(email: string, name: string) {
  return prisma.user.create({
    data: {
      email,
      name,
      password: bcryptjs.hashSync("password123", 10),
      emailVerified: true,
    },
  });
}

async function clearDatabase() {
  await prisma.item.deleteMany({});
  await prisma.sharedLists.deleteMany({});
  await prisma.list.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});
}

describe("ListService", () => {
  let userA: any;
  let userB: any;

  beforeAll(async () => {
    await clearDatabase();
    userA = await createUser("userA@test.com", "User A");
    userB = await createUser("userB@test.com", "User B");
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.sharedLists.deleteMany({});
    await prisma.item.deleteMany({});
    await prisma.list.deleteMany({});
  });

  describe("Own lists (CRUD)", () => {
    it("should create a list and assign it to the correct userId", async () => {
      const list = await listService.createList({
        userId: userA.id,
        title: "Groceries",
        type: "shopping",
        color: "#fff",
        icon: "🛒",
      });

      expect(list.userId).toBe(userA.id);
      expect(list.title).toBe("Groceries");
    });

    it("should allow two different users to have lists with the same title", async () => {
      await listService.createList({
        userId: userA.id,
        title: "My List",
        type: "tasks",
      });

      const listB = await listService.createList({
        userId: userB.id,
        title: "My List",
        type: "tasks",
      });

      expect(listB.userId).toBe(userB.id);
    });

    it("should throw 409 when the same user creates a duplicate title+type list", async () => {
      await listService.createList({
        userId: userA.id,
        title: "Duplicate",
        type: "shopping",
      });

      await expect(
        listService.createList({
          userId: userA.id,
          title: "Duplicate",
          type: "shopping",
        })
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it("should update a list owned by the user", async () => {
      const list = await listService.createList({
        userId: userA.id,
        title: "Old Title",
        type: "tasks",
      });

      const updated = await listService.updateList({
        userId: userA.id,
        id: list.id,
        title: "New Title",
        type: "tasks",
      });

      expect(updated.title).toBe("New Title");
    });

    it("should throw 404 when user B tries to update a list owned by user A", async () => {
      const list = await listService.createList({
        userId: userA.id,
        title: "A Private List",
        type: "tasks",
      });

      await expect(
        listService.updateList({
          userId: userB.id,
          id: list.id,
          title: "Hijacked",
          type: "tasks",
        })
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("should delete a list owned by the user", async () => {
      const list = await listService.createList({
        userId: userA.id,
        title: "To Delete",
        type: "events",
      });

      await listService.deleteList({ userId: userA.id, id: list.id });

      const inDb = await prisma.list.findUnique({ where: { id: list.id } });
      expect(inDb).toBeNull();
    });

    it("should throw 404 when user B tries to delete a list owned by user A", async () => {
      const list = await listService.createList({
        userId: userA.id,
        title: "A Secret List",
        type: "events",
      });

      await expect(
        listService.deleteList({ userId: userB.id, id: list.id })
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe("Access control (_canIDoSomething)", () => {
    let listOfA: any;

    beforeEach(async () => {
      listOfA = await listService.createList({
        userId: userA.id,
        title: "Shared List",
        type: "shopping",
      });
    });

    it("should return true for the list owner", async () => {
      const result = await listService._canIDoSomething({
        userId: userA.id,
        listId: listOfA.id,
        accessTypes: "fullAccess",
      });
      expect(result).toBe(true);
    });

    it("should return false for a user with no access at all", async () => {
      const result = await listService._canIDoSomething({
        userId: userB.id,
        listId: listOfA.id,
        accessTypes: "watch",
      });
      expect(result).toBe(false);
    });

    it("should return true when user has sufficient shared access (edit >= edit)", async () => {
      await prisma.sharedLists.create({
        data: {
          listId: listOfA.id,
          ownerId: userA.id,
          recipientId: userB.id,
          accessTypes: "edit",
        },
      });

      const result = await listService._canIDoSomething({
        userId: userB.id,
        listId: listOfA.id,
        accessTypes: "edit",
      });
      expect(result).toBe(true);
    });

    it("should return false when user has LOWER access than required (watch < edit) — catches the _canIDoSomething bug", async () => {
      await prisma.sharedLists.create({
        data: {
          listId: listOfA.id,
          ownerId: userA.id,
          recipientId: userB.id,
          accessTypes: "watch",
        },
      });

      const result = await listService._canIDoSomething({
        userId: userB.id,
        listId: listOfA.id,
        accessTypes: "edit",
      });

      expect(result).toBe(false);
    });

    it("should return false for a list that does not exist", async () => {
      const result = await listService._canIDoSomething({
        userId: userA.id,
        listId: 999999,
        accessTypes: "watch",
      });
      expect(result).toBe(false);
    });
  });

  describe("shareList — ownership check", () => {
    let listOfA: any;
    let listOfB: any;

    beforeEach(async () => {
      listOfA = await listService.createList({
        userId: userA.id,
        title: "A's List",
        type: "tasks",
      });
      listOfB = await listService.createList({
        userId: userB.id,
        title: "B's List",
        type: "tasks",
      });
    });

    it("should allow the owner to share their own list", async () => {
      const share = await listService.shareList({
        userId: userA.id,
        listId: listOfA.id,
        recipientId: userB.id,
        accessTypes: "watch",
      });

      expect(share.listId).toBe(listOfA.id);
      expect(share.ownerId).toBe(userA.id);
      expect(share.recipientId).toBe(userB.id);
    });

    it("should throw when user B tries to share user A's list — catches the shareList ownership bug", async () => {
      await expect(
        listService.shareList({
          userId: userB.id,
          listId: listOfA.id,
          recipientId: userB.id,
          accessTypes: "watch",
        })
      ).rejects.toMatchObject({ statusCode: expect.any(Number) });
    });

    it("should allow removing a share when called by the owner", async () => {
      await listService.shareList({
        userId: userA.id,
        listId: listOfA.id,
        recipientId: userB.id,
        accessTypes: "watch",
      });

      await expect(
        listService.removeSharingList({
          userId: userA.id,
          listId: listOfA.id,
          recipientId: userB.id,
        })
      ).resolves.not.toThrow();

      const share = await prisma.sharedLists.findFirst({
        where: { listId: listOfA.id },
      });
      expect(share).toBeNull();
    });
  });
});
