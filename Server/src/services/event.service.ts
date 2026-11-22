import prisma from "@config/prisma";
import { Prisma } from "@prisma/client";
import {
  CreateEventBody,
  EventModel,
  ById,
  GetEventsParams,
  PaginatedEventsResponse,
  Repeatability,
  UpdateEventBody,
  WithId,
  WithUserId,
} from "@familyflow/contracts";
import { alreadyExistError, notFoundError } from "@utils";

/**
 * Calculates the next occurrence of an event on or after afterDate.
 * Returns null if the event has no further occurrences.
 */
function getNextOccurrence(
  eventDate: Date,
  repeatability: Repeatability,
  afterDate: Date
): Date | null {
  const base = new Date(eventDate);
  const target = new Date(afterDate);

  if (base >= target) {
    return base;
  }

  if (repeatability === "none") {
    return null;
  }

  const hours = base.getHours();
  const minutes = base.getMinutes();
  const seconds = base.getSeconds();
  const ms = base.getMilliseconds();

  if (repeatability === "day") {
    const candidate = new Date(target);
    candidate.setHours(hours, minutes, seconds, ms);
    if (candidate < target) {
      candidate.setDate(candidate.getDate() + 1);
    }
    return candidate;
  }

  if (repeatability === "working") {
    const candidate = new Date(target);
    candidate.setHours(hours, minutes, seconds, ms);
    if (candidate < target) {
      candidate.setDate(candidate.getDate() + 1);
    }
    while (candidate.getDay() === 0 || candidate.getDay() === 6) {
      candidate.setDate(candidate.getDate() + 1);
    }
    return candidate;
  }

  if (repeatability === "week") {
    const targetDayOfWeek = base.getDay();
    const candidate = new Date(target);
    candidate.setHours(hours, minutes, seconds, ms);
    if (candidate < target) {
      candidate.setDate(candidate.getDate() + 1);
    }
    const diff = (targetDayOfWeek - candidate.getDay() + 7) % 7;
    candidate.setDate(candidate.getDate() + diff);
    return candidate;
  }

  if (repeatability === "month") {
    const dayOfMonth = base.getDate();
    let year = target.getFullYear();
    let month = target.getMonth();

    while (true) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const actualDay = Math.min(dayOfMonth, daysInMonth);
      const candidate = new Date(
        year,
        month,
        actualDay,
        hours,
        minutes,
        seconds,
        ms
      );

      if (candidate >= target && candidate >= base) {
        return candidate;
      }
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }
  }

  if (repeatability === "quarter") {
    const dayOfMonth = base.getDate();
    let year = base.getFullYear();
    let month = base.getMonth();

    while (true) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const actualDay = Math.min(dayOfMonth, daysInMonth);
      const candidate = new Date(
        year,
        month,
        actualDay,
        hours,
        minutes,
        seconds,
        ms
      );

      if (candidate >= target && candidate >= base) {
        return candidate;
      }
      month += 3;
      if (month > 11) {
        year += Math.floor(month / 12);
        month = month % 12;
      }
    }
  }

  if (repeatability === "year") {
    const dayOfMonth = base.getDate();
    const targetMonth = base.getMonth();
    let year = target.getFullYear();

    while (true) {
      const daysInMonth = new Date(year, targetMonth + 1, 0).getDate();
      const actualDay = Math.min(dayOfMonth, daysInMonth);
      const candidate = new Date(
        year,
        targetMonth,
        actualDay,
        hours,
        minutes,
        seconds,
        ms
      );

      if (candidate >= target && candidate >= base) {
        return candidate;
      }
      year++;
    }
  }

  return null;
}

/**
 * Calculates all occurrences of an event within [fromDate, toDate].
 */
function getOccurrencesInRange(
  eventDate: Date,
  repeatability: Repeatability,
  fromDate: Date,
  toDate: Date
): Date[] {
  const base = new Date(eventDate);
  const start = new Date(fromDate);
  const end = new Date(toDate);

  if (base > end) {
    return [];
  }

  if (repeatability === "none") {
    if (base >= start && base <= end) {
      return [base];
    }
    return [];
  }

  const occurrences: Date[] = [];
  let current: Date | null = getNextOccurrence(base, repeatability, start);

  let guard = 0;
  while (current && current <= end && guard < 400) {
    occurrences.push(new Date(current));
    guard++;

    // Advance 1 second past current to find the next occurrence
    const nextTarget = new Date(current.getTime() + 1000);
    current = getNextOccurrence(base, repeatability, nextTarget);
  }

  return occurrences;
}

class EventServices {
  async getUserEvents({
    userId,
    page,
    limit,
    from,
    to,
  }: WithUserId<GetEventsParams>): Promise<PaginatedEventsResponse> {
    const itemsPerPage =
      Number(limit) || Number(process.env.ITEMS_PER_PAGE) || 20;
    const currentPage = Number(page) || 1;

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const baseUserFamilyWhere: Prisma.EventWhereInput = {
      OR: [
        { userId },
        {
          visibility: "shared",
          user: {
            FamilyMember: {
              some: {
                family: {
                  FamilyMember: {
                    some: { userId },
                  },
                },
              },
            },
          },
        },
      ],
    };

    const where: Prisma.EventWhereInput = {
      AND: [
        baseUserFamilyWhere,
        {
          OR: [
            { repeatability: { not: "none" } },
            {
              repeatability: "none",
              ...(fromDate || toDate
                ? {
                    date: {
                      ...(fromDate ? { gte: fromDate } : {}),
                      ...(toDate ? { lte: toDate } : {}),
                    },
                  }
                : {}),
            },
          ],
        },
        ...(toDate ? [{ date: { lte: toDate } }] : []),
      ],
    };

    const rawEvents = await prisma.event.findMany({
      where,
      orderBy: [{ date: "asc" }, { title: "asc" }],
    });

    let expandedEvents: EventModel[] = [];

    if (fromDate && toDate) {
      // 1. Запит діапазону (для календарної сітки): генеруємо всі входження у вікні [from, to]
      for (const ev of rawEvents) {
        const occurrences = getOccurrencesInRange(
          ev.date,
          ev.repeatability as Repeatability,
          fromDate,
          toDate
        );
        for (const occDate of occurrences) {
          expandedEvents.push({
            ...ev,
            date: occDate,
            originalDate: ev.date,
          } as EventModel);
        }
      }
    } else if (fromDate && !toDate) {
      // 2. Запит найближчих подій (from + limit): тільки найближче входження кожної події
      for (const ev of rawEvents) {
        const nextOcc = getNextOccurrence(
          ev.date,
          ev.repeatability as Repeatability,
          fromDate
        );
        if (nextOcc) {
          expandedEvents.push({
            ...ev,
            date: nextOcc,
            originalDate: ev.date,
          } as EventModel);
        }
      }
    } else {
      // 3. Запит без обмежень: розгортаємо на поточний місяць
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      for (const ev of rawEvents) {
        const occurrences = getOccurrencesInRange(
          ev.date,
          ev.repeatability as Repeatability,
          startOfMonth,
          endOfMonth
        );
        for (const occDate of occurrences) {
          expandedEvents.push({
            ...ev,
            date: occDate,
            originalDate: ev.date,
          } as EventModel);
        }
      }
    }

    // Сортуємо всі згенеровані входження хронологічно
    expandedEvents.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const total = expandedEvents.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = expandedEvents.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return {
      data: paginatedData,
      pagination: {
        total,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(total / itemsPerPage) || 1,
      },
    };
  }

  async getEventById({ id }: ById): Promise<EventModel> {
    const event = await prisma.event.findFirst({ where: { id } });

    if (!event) {
      throw notFoundError("Event not found");
    }

    return { ...event, originalDate: event.date } as EventModel;
  }

  async createEvent({
    userId,
    title,
    color = "",
    date = new Date(),
    repeatability = "none",
    visibility = "shared",
  }: WithUserId<CreateEventBody>): Promise<EventModel> {
    const haveEvent = await prisma.event.findFirst({
      where: { userId, title, color, date },
    });

    if (haveEvent) {
      throw alreadyExistError("Event already exists");
    }

    const newEvent = await prisma.event.create({
      data: { userId, title, color, date, repeatability, visibility },
    });

    return newEvent as EventModel;
  }

  async updateEvent({
    id,
    title,
    color,
    date,
    repeatability,
    visibility,
  }: WithId<UpdateEventBody>): Promise<EventModel> {
    const haveEvent = await prisma.event.findFirst({
      where: { id },
    });

    if (!haveEvent) {
      throw notFoundError("Event not found");
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        color,
        date,
        ...(repeatability ? { repeatability } : {}),
        ...(visibility ? { visibility } : {}),
      },
    });

    return updatedEvent as EventModel;
  }

  async deleteEvent({ id }: ById): Promise<void> {
    const haveEvent = await prisma.event.findFirst({
      where: { id },
    });

    if (!haveEvent) {
      throw notFoundError("Event not found");
    }

    await prisma.event.delete({ where: { id } });
  }
}

export default new EventServices();



