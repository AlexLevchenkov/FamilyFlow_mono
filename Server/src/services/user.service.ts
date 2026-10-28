import bcryptjs from "bcryptjs";
import prisma from "@config/prisma";
import {
  GetUsersParams,
  PaginatedUsersResponse,
  RegisterUserBody,
  ById,
  UpdateUserBody,
  UserDetail,
  UserPublic,
} from "@familyflow/contracts";
import {
  alreadyExistError,
  internalServerError,
  notFoundError,
  sendCheckEmail,
} from "@utils";

class UserService {
  async getUsers({
    page,
    partName,
    partEmail,
  }: GetUsersParams): Promise<PaginatedUsersResponse> {
    const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
    const where = {
      AND: [
        partEmail ? { email: { contains: partEmail } } : {},
        partName ? { name: { contains: partName } } : {},
      ],
    };

    const users = await prisma.user.findMany({
      where,
      skip: page ? Number(page) * itemsPerPage : 0,
      take: itemsPerPage,
      orderBy: { updatedAt: "desc" },
    });

    const total = await prisma.user.count({ where });

    if (users.length === 0) {
      throw notFoundError("User not found");
    }

    return {
      data: users.map(user => ({
        name: user.name,
        avatar: user.avatar,
      })),
      pagination: {
        total,
        page: page || 1,
        limit: itemsPerPage,
        totalPages: Math.ceil(total / itemsPerPage),
      },
    };
  }

  async register({
    email,
    password,
    name,
  }: RegisterUserBody): Promise<UserPublic> {
    const haveUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (haveUser) {
      throw alreadyExistError("User already exists");
    }

    const newAccessToken = crypto.randomUUID();

    const user = await prisma.user.create({
      data: {
        email: email,
        password: bcryptjs.hashSync(password, 10),
        name: name,
        resetToken: newAccessToken,
        emailVerified: false,
      },
    });

    await sendCheckEmail(email, newAccessToken);

    return { avatar: user.avatar, name: user.name };
  }

  async getUserById({ id }: ById): Promise<UserDetail> {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw notFoundError("User not found");
    }

    return user;
  }

  async updateUser({
    userId,
    name,
    avatar,
    email,
  }: UpdateUserBody): Promise<UserDetail> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw notFoundError("User not found");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatar,
        name,
        email,
        updatedAt: new Date(),
      },
    });

    return updatedUser;
  }

  async deleteUser({ id }: ById): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw notFoundError("User not found");
    }

    const result = await prisma.user.delete({ where: { id } });
    await prisma.refreshToken.deleteMany({ where: { userId: id } });

    if (!result) {
      throw internalServerError("Failed to delete user");
    }
  }
}

export default new UserService();
