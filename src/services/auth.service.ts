import prisma from "@config/prisma";
import { ChangePasswordInput, LoginInput, RefreshTokenInput, LogoutInput } from "@middleware/schemas/auth";
import { WithUserId } from "@middleware/schemas/list";
import { internalServerError, notFoundError, unauthorizedError } from "@utils/errors";
import { sendResetEmail } from "@utils/Email";
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
      throw unauthorizedError("Invalid email or password");
    }

    const jti = randomUUID();

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id, jti);

    if (!accessToken || !refreshToken) {
      throw internalServerError("Failed to generate tokens user.id: " + user.id);
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
      throw notFoundError("User not found");
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
      throw notFoundError("User not found");
    }

    const existing = await prisma.refreshToken.findFirst({
      where: { userId, jti },
    });
    if (!existing) {
      throw unauthorizedError("Invalid refresh token");
    }

    await prisma.refreshToken.delete({ where: { id: existing.id } });

    if (existing.expiresAt && existing.expiresAt < new Date()) {
      // remove expired token
      throw unauthorizedError("Refresh token expired");
    }

    const newJti = randomUUID();

    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId, newJti);

    if (!newAccessToken || !newRefreshToken) {
      throw internalServerError("Failed to generate tokens. UserId: " + userId);
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
      throw notFoundError("User not found");
    }

    if (!bcryptjs.compareSync(currentPassword, user.password)) {
      throw unauthorizedError("Incorrect password");
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
      throw notFoundError("User not found");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: bcryptjs.hashSync(password, 10),
      },
    });
  }

  requestPasswordReset = async ({email} : {email: string}) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw notFoundError("User not found");
    }
  
    const newAccessToken = crypto.randomUUID();
  
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: newAccessToken, resetTokenExp: new Date(Date.now() + 15 * 60 * 1000) },
    });
  
    await sendResetEmail(email, newAccessToken);
    return true;
  };

  resetPassword = async ({ token, newPassword } : { token: string, newPassword: string }) => {
    const user = await prisma.user.findFirst({ where: { resetToken: token } });

    if (!user || user.resetTokenExp == null || user.resetTokenExp < new Date()) {
      throw unauthorizedError("Invalid or expired token");
    }

    const hashed = await bcryptjs.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, resetToken: null, resetTokenExp: null },
    });

    return true;
  };

  verifyEmail = async ({ token } : { token: string }) => {
    const user = await prisma.user.findFirst({ where: { resetToken: token } });

    if (!user) {
      throw unauthorizedError("Invalid or expired token");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: null, emailVerified: true },
    });

    return true;
  };

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
