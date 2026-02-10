import prisma from "@config/prisma";
import { ChangePasswordInput, LoginInput, RefreshTokenInput, LogoutInput } from "@middleware/schemas/auth";
import { WithUserId } from "@middleware/schemas/list";
import { badRequestError } from "@utils/errors";
import { generateAccessToken, generateRefreshToken } from "@utils/tokens";
import bcryptjs from "bcryptjs";
import { randomUUID } from "crypto";

class AuthService {
  login = async ({ email, password }: LoginInput) => {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || !bcryptjs.compareSync(password, user.password)) {
      throw badRequestError("Invalid email or password");
    }

    const jti = randomUUID();

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id, jti);

    if (!accessToken || !refreshToken) {
      throw badRequestError("Failed to generate tokens user.id: " + user.id);
    }

    await prisma.refreshToken.create({
      data: {
        jti,
        userId: user.id,
        expiresAt: new Date(
          Date.now() +
          parseInt(process.env.REFRESH_EXPIRES_IN || "14") *
          24 *
          60 *
          60 *
          1000
        ),
      },
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  logout = async ({ userId, jti }: WithUserId<LogoutInput>) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw badRequestError("User not found");
    }

    if (jti) {
      await prisma.refreshToken.deleteMany({
        where: { userId, jti },
      });
    } else {
      await prisma.refreshToken.deleteMany({ where: { userId: userId } });
    }
  }

  refreshToken = async ({ userId, jti }: WithUserId<RefreshTokenInput>) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw badRequestError("User not found");
    }

    const existing = await prisma.refreshToken.findFirst({
      where: { userId, jti },
    });
    if (!existing) {
      throw badRequestError("Invalid refresh token");
    }

    await prisma.refreshToken.delete({ where: { id: existing.id } });

    if (existing.expiresAt && existing.expiresAt < new Date()) {
      // remove expired token
      throw badRequestError("Refresh token expired");
    }

    const newJti = randomUUID();

    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId, newJti);

    if (!newAccessToken || !newRefreshToken) {
      throw badRequestError("Failed to generate tokens. UserId: " + userId);
    }

    await prisma.refreshToken.create({
      data: {
        userId: userId,
        jti: newJti,
        expiresAt: new Date(
          Date.now() +
          parseInt(process.env.REFRESH_EXPIRES_IN || "30") *
          24 *
          60 *
          60 *
          1000
        ),
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  changePassword = async ({ userId, currentPassword, password }: WithUserId<ChangePasswordInput>) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw badRequestError("User not found");
    }

    if (!bcryptjs.compareSync(currentPassword, user.password)) {
      throw badRequestError("Incorrect password");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: bcryptjs.hashSync(password, 10),
      },
    });
  }

  setPassword = async ({ userId, password }: { userId: number; password: string; }) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw badRequestError("User not found");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: bcryptjs.hashSync(password, 10),
      },
    });
  }

  _removeAllOldTokens = async () => {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}

export default new AuthService();
