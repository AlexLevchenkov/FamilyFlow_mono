import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import authService from "@/services/auth.service";
import userService from "@/services/user.service";
import prisma from "@/config/prisma";
import { sendCheckEmail } from "@/utils";

jest.mock("@/utils", () => {
  const actual = jest.requireActual("@/utils");
  return {
    ...actual,
    sendCheckEmail: jest.fn(),
    sendResetEmail: jest.fn(),
  };
});

describe("AuthService & UserService Registration/Login", () => {
  const testEmail = "test@example.com";
  const testPassword = "password123";
  const testName = "Test User";

  async function clearDatabase() {
    await prisma.item.deleteMany({});
    await prisma.sharedLists.deleteMany({});
    await prisma.list.deleteMany({});
    await prisma.refreshToken.deleteMany({});
    await prisma.user.deleteMany({});
  }

  beforeAll(async () => {
    await clearDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe("User Registration", () => {
    it("should register a new user, hash the password, and send a verification email", async () => {
      const result = await userService.register({
        email: testEmail,
        password: testPassword,
        name: testName,
      });

      expect(result).toHaveProperty("name", testName);

      const dbUser = await prisma.user.findUnique({
        where: { email: testEmail },
      });
      expect(dbUser).not.toBeNull();
      expect(dbUser!.password).not.toBe(testPassword);
      expect(bcryptjs.compareSync(testPassword, dbUser!.password)).toBe(true);

      expect(sendCheckEmail).toHaveBeenCalledWith(
        testEmail,
        expect.any(String)
      );
    });

    it("should not allow registering an existing email", async () => {
      await userService.register({
        email: testEmail,
        password: testPassword,
        name: testName,
      });

      await expect(
        userService.register({
          email: testEmail,
          password: "differentpassword",
          name: "Another Name",
        })
      ).rejects.toThrow(/User already exists/);
    });
  });

  describe("User Login", () => {
    let registeredUser: any;

    beforeEach(async () => {
      await userService.register({
        email: testEmail,
        password: testPassword,
        name: testName,
      });
      registeredUser = await prisma.user.findUnique({
        where: { email: testEmail },
      });
    });

    it("should successfully log in and return tokens and user details", async () => {
      const loginResult = await authService.login({
        email: testEmail,
        password: testPassword,
      });

      expect(loginResult).toHaveProperty("accessToken");
      expect(loginResult).toHaveProperty("refreshToken");
      expect(loginResult.user.id).toBe(registeredUser.id);

      const dbTokens = await prisma.refreshToken.findMany({
        where: { userId: registeredUser.id },
      });
      expect(dbTokens.length).toBe(1);
      expect(dbTokens[0].jti).toBeDefined();
    });

    it("should throw unauthorized error for invalid password", async () => {
      await expect(
        authService.login({
          email: testEmail,
          password: "wrongpassword",
        })
      ).rejects.toThrow(/Invalid email or password/);
    });

    it("should throw unauthorized error for non-existent email", async () => {
      await expect(
        authService.login({
          email: "nonexistent@example.com",
          password: testPassword,
        })
      ).rejects.toThrow(/Invalid email or password/);
    });
  });

  describe("Refresh Token Rotation", () => {
    let user: any;
    let initialTokens: any;

    beforeEach(async () => {
      await userService.register({
        email: testEmail,
        password: testPassword,
        name: testName,
      });
      user = await prisma.user.findUnique({ where: { email: testEmail } });
      initialTokens = await authService.login({
        email: testEmail,
        password: testPassword,
      });
    });

    it("should successfully rotate tokens", async () => {
      const decoded: any = jwt.decode(initialTokens.refreshToken);
      const userData = {
        id: user.id,
        jti: decoded.jti,
        role: "user",
      };

      const rotated = await authService.refreshToken(userData);

      expect(rotated).toHaveProperty("accessToken");
      expect(rotated).toHaveProperty("refreshToken");
      expect(rotated.refreshToken).not.toBe(initialTokens.refreshToken);

      const oldTokenInDb = await prisma.refreshToken.findFirst({
        where: { jti: decoded.jti },
      });
      expect(oldTokenInDb).toBeNull();

      const newDecoded: any = jwt.decode(rotated.refreshToken);
      const newTokenInDb = await prisma.refreshToken.findFirst({
        where: { jti: newDecoded.jti },
      });
      expect(newTokenInDb).not.toBeNull();
    });

    it("should reject refresh requests if old token has been rotated/deleted", async () => {
      const decoded: any = jwt.decode(initialTokens.refreshToken);
      const userData = {
        id: user.id,
        jti: decoded.jti,
        role: "user",
      };

      await authService.refreshToken(userData);

      await expect(authService.refreshToken(userData)).rejects.toThrow(
        /Invalid refresh token/
      );
    });

    it("should reject refresh requests if token is expired", async () => {
      const decoded: any = jwt.decode(initialTokens.refreshToken);
      const userData = {
        id: user.id,
        jti: decoded.jti,
        role: "user",
      };

      const expiredDate = new Date(Date.now() - 1000);
      await prisma.refreshToken.updateMany({
        where: { jti: decoded.jti },
        data: { expiresAt: expiredDate },
      });

      await expect(authService.refreshToken(userData)).rejects.toThrow(
        /Refresh token expired/
      );
    });
  });
});
