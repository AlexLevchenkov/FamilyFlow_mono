import prisma from "@config/prisma";
import authService from "@services/auth.service";
import eventService from "@services/event.service";
import familyService from "@services/family.service";
import goalService from "@services/goal.service";
import taskService from "@services/task.service";
import userService from "@services/user.service";
import type { FamilyRole } from "@familyflow/contracts";
import type { Repeatability, Type, Visibility } from "@prisma/client";

const SEED_PASSWORD = "SeedPass1!";

type SeedUserKey = "owner" | "parent" | "child" | "member" | "outsider";

const seedUsers: Array<{
  key: SeedUserKey;
  email: string;
  name: string;
}> = [
  { key: "owner", email: "seed.owner@familyflow.test", name: "Seed Owner" },
  { key: "parent", email: "seed.parent@familyflow.test", name: "Seed Parent" },
  { key: "child", email: "seed.child@familyflow.test", name: "Seed Child" },
  { key: "member", email: "seed.member@familyflow.test", name: "Seed Member" },
  {
    key: "outsider",
    email: "seed.outsider@familyflow.test",
    name: "Seed Outsider",
  },
];

const taskSamples: Array<{
  owner: SeedUserKey;
  title: string;
  type: Type;
  visibility: Visibility;
  daysFromNow: number;
}> = [
  {
    owner: "owner",
    title: "[seed] Grocery run",
    type: "home",
    visibility: "shared",
    daysFromNow: 1,
  },
  {
    owner: "parent",
    title: "[seed] Family movie night",
    type: "family",
    visibility: "shared",
    daysFromNow: 3,
  },
  {
    owner: "owner",
    title: "[seed] Finish quarterly report",
    type: "work",
    visibility: "personal",
    daysFromNow: 5,
  },
  {
    owner: "parent",
    title: "[seed] Evening walk",
    type: "health",
    visibility: "personal",
    daysFromNow: 0,
  },
  {
    owner: "member",
    title: "[seed] Pay utility bills",
    type: "finance",
    visibility: "secret",
    daysFromNow: 2,
  },
  {
    owner: "child",
    title: "[seed] Math homework",
    type: "learning",
    visibility: "personal",
    daysFromNow: 1,
  },
  {
    owner: "outsider",
    title: "[seed] Personal journal",
    type: "personal",
    visibility: "secret",
    daysFromNow: 7,
  },
  {
    owner: "member",
    title: "[seed] Call grandparents",
    type: "social",
    visibility: "shared",
    daysFromNow: 4,
  },
  {
    owner: "parent",
    title: "[seed] Pack weekend bags",
    type: "travel",
    visibility: "shared",
    daysFromNow: 10,
  },
  {
    owner: "owner",
    title: "[seed] Unsorted errands",
    type: "other",
    visibility: "personal",
    daysFromNow: 6,
  },
];

const eventSamples: Array<{
  owner: SeedUserKey;
  title: string;
  color: string;
  repeatability: Repeatability;
  daysFromNow: number;
}> = [
  {
    owner: "owner",
    title: "[seed] Morning standup",
    color: "#2563eb",
    repeatability: "day",
    daysFromNow: 0,
  },
  {
    owner: "parent",
    title: "[seed] School drop-off",
    color: "#16a34a",
    repeatability: "working",
    daysFromNow: 1,
  },
  {
    owner: "child",
    title: "[seed] Piano lesson",
    color: "#9333ea",
    repeatability: "week",
    daysFromNow: 2,
  },
  {
    owner: "member",
    title: "[seed] Rent due",
    color: "#dc2626",
    repeatability: "month",
    daysFromNow: 5,
  },
  {
    owner: "owner",
    title: "[seed] Family budget review",
    color: "#ca8a04",
    repeatability: "quarter",
    daysFromNow: 14,
  },
  {
    owner: "parent",
    title: "[seed] Anniversary",
    color: "#db2777",
    repeatability: "year",
    daysFromNow: 30,
  },
];

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function ensureUser(email: string, name: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return existing;
  }

  try {
    await userService.register({ email, password: SEED_PASSWORD, name });
  } catch (error) {
    const createdDespiteError = await prisma.user.findUnique({
      where: { email },
    });
    if (createdDespiteError) {
      return createdDespiteError;
    }
    throw error;
  }

  const created = await prisma.user.findUnique({ where: { email } });
  if (!created) {
    throw new Error(`Failed to create seed user ${email}`);
  }
  return created;
}

async function seed() {
  const usersByKey = {} as Record<SeedUserKey, { id: number; email: string }>;

  for (const spec of seedUsers) {
    const user = await ensureUser(spec.email, spec.name);
    usersByKey[spec.key] = { id: user.id, email: user.email };
  }

  const owner = usersByKey.owner;
  const ownerRecord = await prisma.user.findUnique({ where: { id: owner.id } });
  if (ownerRecord?.resetToken) {
    await authService.verifyEmail({ token: ownerRecord.resetToken });
  } else {
    await prisma.user.update({
      where: { id: owner.id },
      data: { emailVerified: true, resetToken: null, resetTokenExp: null },
    });
  }

  await userService.updateUser({
    userId: owner.id,
    name: "Seed Owner",
    avatar: "https://example.com/avatars/seed-owner.png",
    email: owner.email,
  });

  for (const spec of seedUsers) {
    const userId = usersByKey[spec.key].id;
    const hasToken = await prisma.refreshToken.findFirst({ where: { userId } });
    if (!hasToken) {
      await authService.login({
        email: spec.email,
        password: SEED_PASSWORD,
      });
    }
  }

  const seedUserIds = Object.values(usersByKey).map(user => user.id);
  for (const userId of seedUserIds) {
    const tokens = await prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { id: "asc" },
    });
    if (tokens.length > 1) {
      await prisma.refreshToken.deleteMany({
        where: { id: { in: tokens.slice(1).map(token => token.id) } },
      });
    }
  }

  let family = await prisma.family.findFirst({
    where: { name: "Seed Family" },
  });

  if (!family) {
    const created = await familyService.createFamily({
      userId: owner.id,
      name: "Seed Family",
    });
    if (!created) {
      throw new Error("Failed to create seed family");
    }
    family = created;
  }

  const membersToAdd: Array<{ key: SeedUserKey; role: FamilyRole }> = [
    { key: "parent", role: "PARENT" },
    { key: "child", role: "CHILD" },
    { key: "member", role: "MEMBER" },
  ];

  for (const { key, role } of membersToAdd) {
    const alreadyMember = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId: family.id,
          userId: usersByKey[key].id,
        },
      },
    });
    if (!alreadyMember) {
      await familyService.addMember({
        userId: owner.id,
        familyId: family.id,
        email: usersByKey[key].email,
        role,
      });
    }
  }

  for (const task of taskSamples) {
    const userId = usersByKey[task.owner].id;
    const existing = await prisma.task.findFirst({
      where: { userId, title: task.title, type: task.type },
    });
    if (!existing) {
      await taskService.createTask({
        userId,
        title: task.title,
        type: task.type,
        visibility: task.visibility,
        date: daysFromNow(task.daysFromNow),
      });
    }
  }

  for (const event of eventSamples) {
    const userId = usersByKey[event.owner].id;
    const existing = await prisma.event.findFirst({
      where: { userId, title: event.title },
    });
    if (!existing) {
      await eventService.createEvent({
        userId,
        title: event.title,
        color: event.color,
        date: daysFromNow(event.daysFromNow),
        repeatability: event.repeatability,
      });
    }
  }

  const seedEvents = await prisma.event.findMany({
    where: { title: { startsWith: "[seed]" } },
    orderBy: { id: "asc" },
  });
  const seenEvents = new Set<string>();
  const duplicateEventIds: number[] = [];
  for (const event of seedEvents) {
    const key = `${event.userId}:${event.title}`;
    if (seenEvents.has(key)) {
      duplicateEventIds.push(event.id);
    } else {
      seenEvents.add(key);
    }
  }
  if (duplicateEventIds.length > 0) {
    await prisma.event.deleteMany({ where: { id: { in: duplicateEventIds } } });
  }

  const amountGoal =
    (await prisma.goal.findFirst({
      where: { createdById: owner.id, title: "[seed] Vacation fund" },
    })) ??
    (await goalService.createGoal({
      userId: owner.id,
      title: "[seed] Vacation fund",
      description: "Save for a family trip",
      type: "AMOUNT",
      status: "ACTIVE",
      currentValue: 250,
      targetValue: 2000,
      unit: "cash",
      currency: "USD",
      startsAt: daysFromNow(-10),
      dueDate: daysFromNow(90),
    }));

  const counterGoal = await prisma.goal.findFirst({
    where: {
      createdById: usersByKey.parent.id,
      title: "[seed] Books read",
    },
  });
  if (!counterGoal) {
    await goalService.createGoal({
      userId: usersByKey.parent.id,
      title: "[seed] Books read",
      description: "Read 12 books",
      type: "COUNTER",
      status: "COMPLETED",
      currentValue: 12,
      targetValue: 12,
      currency: "books",
      unit: null,
      startsAt: daysFromNow(-60),
      dueDate: daysFromNow(-1),
    });
  }

  const stepsGoal =
    (await prisma.goal.findFirst({
      where: {
        createdById: usersByKey.member.id,
        title: "[seed] Kitchen remodel",
      },
    })) ??
    (await goalService.createGoal({
      userId: usersByKey.member.id,
      title: "[seed] Kitchen remodel",
      description: "Step-by-step home project",
      type: "STEPS",
      status: "ARCHIVED",
      currentValue: 1,
      targetValue: 3,
      currency: null,
      unit: "steps",
      startsAt: daysFromNow(-30),
      dueDate: daysFromNow(120),
    }));

  const stepsGoalId = stepsGoal.id;

  if (stepsGoalId) {
    const existingSteps = await prisma.goalStep.count({
      where: { goalId: stepsGoalId },
    });

    if (existingSteps === 0) {
      await prisma.goalStep.createMany({
        data: [
          {
            goalId: stepsGoalId,
            title: "Measure cabinets",
            description: "Record current kitchen dimensions",
            position: 0,
            completed: true,
            completedAt: daysFromNow(-20),
          },
          {
            goalId: stepsGoalId,
            title: "Choose materials",
            description: "Pick countertop and paint",
            position: 1,
            completed: false,
          },
          {
            goalId: stepsGoalId,
            title: "Install hardware",
            description: "Finish remaining fixtures",
            position: 2,
            completed: false,
          },
        ],
      });
    }
  }

  const counts = {
    users: await prisma.user.count({
      where: { email: { in: seedUsers.map(user => user.email) } },
    }),
    refreshTokens: await prisma.refreshToken.count({
      where: { userId: { in: Object.values(usersByKey).map(user => user.id) } },
    }),
    families: await prisma.family.count({ where: { id: family.id } }),
    familyMembers: await prisma.familyMember.count({
      where: { familyId: family.id },
    }),
    tasks: await prisma.task.count({
      where: { title: { startsWith: "[seed]" } },
    }),
    events: await prisma.event.count({
      where: { title: { startsWith: "[seed]" } },
    }),
    goals: await prisma.goal.count({
      where: { title: { startsWith: "[seed]" } },
    }),
    goalSteps: stepsGoalId
      ? await prisma.goalStep.count({ where: { goalId: stepsGoalId } })
      : 0,
  };

  console.log("Seed complete.");
  console.log("Login password for all seed users:", SEED_PASSWORD);
  console.log("Created / reused records:", counts);
  if (amountGoal) {
    console.log("Sample goal id:", amountGoal.id);
  }
}

seed()
  .catch(error => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
