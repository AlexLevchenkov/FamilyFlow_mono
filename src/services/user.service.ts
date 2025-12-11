import prisma from "@config/prisma";
import {
  GetUsersInput,
  RegisterInput,
  UpdateUserInput,
  GetUserByIdInput,
  DeleteUserInput,
} from "@middleware/user";
import { badRequestError } from "@utils/errors";
import bcryptjs from "bcryptjs";

class UserService {
  async getUsers({ page, partName, partEmail }: GetUsersInput) {
    
    const where = {
      AND: [
        partEmail ? { email: { contains: partEmail } } : {},
        partName ? { name: { contains: partName } } : {},
      ]
    };

    const users = await prisma.user.findMany({
      where,
      skip: page ? Number(page) * 20 : 0,
      take: 20,
    });
  
    const total = await prisma.user.count({ where });

    if (users.length === 0) {
      badRequestError("Can't get any users");
      return;
    }

    return {
      data: users.map((user) => ({...user, password: undefined})),
      pagination: {
        total,
        page: page || 1,
        limit: 20,
        totalPages: Math.ceil(total/20)
      }
    }
  }
  
  async register({ email, password, name }: RegisterInput) {
    if (!email || !password || !name) {
      badRequestError("Missing required fields");
      return;
    }

    const haveUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (haveUser) {
      badRequestError("User already exists");
      return;
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
    if (!userId) {
      badRequestError("Missing required fields");
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      badRequestError("User not found");
      return;
    }

    return user;
  }

  async updateUser({ userId, name, avatar, email }: UpdateUserInput) {
    if (!userId) {
      badRequestError("Missing required fields");
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      badRequestError("User not found");
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatar,
        name,
        email,
        updatedAt: new Date(),
      }
    })

    return updatedUser
  }

  async deleteUser({ userId }: DeleteUserInput) {
    if (!userId) {
      badRequestError("Missing required fields");
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      badRequestError("User not found");
      return;
    }

    const result = await prisma.user.delete({ where: { id: userId } });

    if (!result) {
      badRequestError("Failed to delete user");
      return;
    }

    return true;
  }
}

export default new UserService();
