import { Request } from "express";
import bcryptjs from "bcryptjs";
import { randomUUID } from "crypto";
import prisma from "@config/prisma";
import {
  ForgotPasswordBody,
  LoginDataResponse,
  LoginBody,
  RefreshTokenResponse,
  ResetPasswordBody,
  VerifyEmailQuery,
  WithUserId,
  JTI,
} from "@familyflow/contracts";
import {
  generateAccessToken,
  generateRefreshToken,
  internalServerError,
  notFoundError,
  sendResetEmail,
  unauthorizedError,
} from "@utils";

class AuthService {
  login = async ({
    email,
    password,
  }: LoginBody): Promise<LoginDataResponse> => {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || !bcryptjs.compareSync(password, user.password)) {
      throw unauthorizedError("Invalid email or password");
    }

    const jti = randomUUID();

    const accessToken = generateAccessToken(user.id, jti);
    const refreshToken = generateRefreshToken(user.id, jti);

    if (!accessToken || !refreshToken) {
      throw internalServerError(
        "Failed to generate tokens user.id: " + user.id
      );
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
  };

  logout = async ({ userId, jti }: WithUserId<JTI>): Promise<void> => {
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
  };

  refreshToken = async ({
    userId,
    jti,
  }: WithUserId<JTI>): Promise<RefreshTokenResponse> => {
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
      throw unauthorizedError("Refresh token expired");
    }

    const newJti = randomUUID();

    const newAccessToken = generateAccessToken(userId, newJti);
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
  };

  requestPasswordReset = async ({
    email,
  }: ForgotPasswordBody): Promise<void> => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw notFoundError("User not found");
    }

    const newAccessToken = randomUUID();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: newAccessToken,
        resetTokenExp: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await sendResetEmail(email, newAccessToken);
  };

  resetPassword = async ({
    token,
    newPassword,
  }: ResetPasswordBody): Promise<void> => {
    const user = await prisma.user.findFirst({ where: { resetToken: token } });

    if (
      !user ||
      user.resetTokenExp == null ||
      user.resetTokenExp < new Date()
    ) {
      throw unauthorizedError("Invalid or expired token");
    }

    const hashed = await bcryptjs.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, resetToken: null, resetTokenExp: null },
    });
  };

  verifyEmail = async ({ token }: VerifyEmailQuery): Promise<void> => {
    const user = await prisma.user.findFirst({ where: { resetToken: token } });

    if (!user) {
      throw unauthorizedError("Invalid or expired token");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: null, resetTokenExp: null, emailVerified: true },
    });
  };

  _removeAllOldTokens = async () => {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  };
}

export default new AuthService();
