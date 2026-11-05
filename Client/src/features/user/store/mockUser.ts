import type { RegisterUserBody, UpdateUserBody, UserDetail } from '@types';

export const INITIAL_USERS: UserDetail[] = [
  {
    id: 1,
    email: 'alex@familyflow.local',
    name: 'Олексій Коваль',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
    emailVerified: true,
    createdAt: new Date('2026-01-10T10:00:00.000Z'),
    updatedAt: new Date('2026-03-20T12:00:00.000Z'),
  },
  {
    id: 2,
    email: 'anna@familyflow.local',
    name: 'Анна Коваль',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150',
    emailVerified: true,
    createdAt: new Date('2026-01-11T11:00:00.000Z'),
    updatedAt: new Date('2026-03-18T14:30:00.000Z'),
  },
  {
    id: 3,
    email: 'mark@familyflow.local',
    name: 'Марк Коваль',
    avatar: null,
    emailVerified: true,
    createdAt: new Date('2026-02-01T09:00:00.000Z'),
    updatedAt: new Date('2026-03-15T08:00:00.000Z'),
  },
  {
    id: 4,
    email: 'sofia@familyflow.local',
    name: 'Софія Коваль',
    avatar: null,
    emailVerified: true,
    createdAt: new Date('2026-02-01T09:30:00.000Z'),
    updatedAt: new Date('2026-03-10T16:00:00.000Z'),
  },
];

export class MockUserDatabase {
  private users: UserDetail[] = [];
  private nextUserId: number = 1;

  constructor() {
    this.reset();
  }

  public reset() {
    this.users = [...INITIAL_USERS];
    this.nextUserId = INITIAL_USERS.length + 1;
  }

  public getUsers(partName?: string, partEmail?: string) {
    let result = [...this.users];
    if (partName) {
      result = result.filter(u =>
        u.name?.toLowerCase().includes(partName.toLowerCase())
      );
    }
    if (partEmail) {
      result = result.filter(u =>
        u.email.toLowerCase().includes(partEmail.toLowerCase())
      );
    }
    return result;
  }

  public getUserById(id: number) {
    return this.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser({ email, name }: RegisterUserBody) {
    const newUser: UserDetail = {
      id: this.nextUserId++,
      email,
      name,
      avatar: null,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  public updateUser({ userId, name, email, avatar }: UpdateUserBody) {
    const user = this.getUserById(userId);
    if (!user) return null;
    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    user.updatedAt = new Date();
    return user;
  }

  public deleteUser(userId: number) {
    this.users = this.users.filter(u => u.id !== userId);
  }
}
