import prisma from "@config/prisma";
import {
  GetUsersInput,
  RegisterInput,
  UpdateUserInput,
  GetUserByIdInput,
  DeleteUserInput,
} from "@middleware/schemas/user";
import { badRequestError } from "@utils/errors";
import bcryptjs from "bcryptjs";

class UserService {
  async getUsers({ page, partName, partEmail }: GetUsersInput) {
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
      throw badRequestError("Can't get any users");``
    }

    return {
      data: users.map((user) => ({ ...user, password: undefined })),
      pagination: {
        total,
        page: page || 1,
        limit: itemsPerPage,
        totalPages: Math.ceil(total / itemsPerPage),
      },
    };
  }

  async register({ email, password, name }: RegisterInput) {
    const haveUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (haveUser) {
      throw badRequestError("User already exists");
    }

    const user = await prisma.user.create({
      data: {
        email: email,
        password: bcryptjs.hashSync(password, 10),
        name: name,
      },
    });

    return { ...user, password: undefined };
  }

  async getUserById({ userId }: GetUserByIdInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw badRequestError("User not found");
    }

    return user;
  }

  async updateUser({ userId, name, avatar, email }: UpdateUserInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw badRequestError("User not found");
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

  async deleteUser({ userId }: DeleteUserInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw badRequestError("User not found");
    }

    const result = await prisma.user.delete({ where: { id: userId } });
    await prisma.refreshToken.deleteMany({ where: { userId } });

    if (!result) {
      throw badRequestError("Failed to delete user");
    }
  }
}

export default new UserService();
