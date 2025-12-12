import prisma from "@config/prisma";
import { ChangePasswordInput, LoginInput, RefreshTokenInput, LogoutInput } from "@middleware/auth";
import { badRequestError } from "@utils/errors";
import { generateAccessToken, generateRefreshToken } from "@utils/tokens";
import bcryptjs from "bcryptjs";

class AuthService {
  async login({ email, password, deviceId, ipAddress }: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || !bcryptjs.compareSync(password, user.password)) {
      badRequestError("Invalid email or password");
      return;
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    if (!accessToken || !refreshToken) {
      badRequestError("Failed to generate tokens. user.id: " + user.id);
      return;
    }

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        deviceId,
        ipAddress,
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
      user,
      accessToken,
      refreshToken,
    };
  }

  async logout({ userId, deviceId }: LogoutInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      badRequestError("User not found");
      return;
    }

    if (deviceId) {
      await prisma.refreshToken.deleteMany({
        where: { userId: userId, deviceId: deviceId },
      });
    } else {
      await prisma.refreshToken.deleteMany({ where: { userId: userId } });
    }

    return true;
  }

  async refreshToken({ userId, refreshToken }: RefreshTokenInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      badRequestError("User not found");
      return;
    }

    const existing = await prisma.refreshToken.findFirst({
      where: { userId: userId, token: refreshToken },
    });
    if (!existing) {
      badRequestError("Invalid refresh token");
      return;
    }

    if (existing.expiresAt && existing.expiresAt < new Date()) {
      // remove expired token
      await prisma.refreshToken.deleteMany({ where: { id: existing.id } });
      badRequestError("Refresh token expired");
      return;
    }

    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    if (!newAccessToken || !newRefreshToken) {
      badRequestError("Failed to generate tokens. UserId: " + userId);
      return;
    }

    // Rotate: delete existing token(s) for same user+device, then create new one
    if (existing.deviceId) {
      await prisma.refreshToken.deleteMany({
        where: { userId: userId, deviceId: existing.deviceId },
      });
    } else {
      // fallback: delete the exact token record
      await prisma.refreshToken.deleteMany({ where: { id: existing.id } });
    }

    await prisma.refreshToken.create({
      data: {
        userId: userId,
        token: newRefreshToken,
        deviceId: existing.deviceId || undefined,
        ipAddress: existing.ipAddress || undefined,
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

  async changePassword({ userId, oldPassword, newPassword }: ChangePasswordInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      badRequestError("User not found");
      console.log("User not found");
      return;
    }

    if (user.password != bcryptjs.hashSync(oldPassword, 10)) {
      badRequestError("Incorrect password");
      console.log("Incorrect password");
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: bcryptjs.hashSync(newPassword, 10),
      },
    });

    // TODO update return value
    return true;
  }

  async setPassword({ userId, newPassword, }: { userId: number; newPassword: string; }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      badRequestError("User not found");
      console.log("User not found");
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: bcryptjs.hashSync(newPassword, 10),
      },
    });

    // TODO update return value
    return true;
  }

  async _removeAllOldTokens() {
    const currentTime = new Date();
    const oldTokens = await prisma.refreshToken.findMany({
      where: {
        expiresAt: {
          lte: currentTime,
        },
      },
    });

    for (const token of oldTokens) {
      await prisma.refreshToken.delete({ where: { id: token.id } });
    }
  }
}

export default new AuthService();
