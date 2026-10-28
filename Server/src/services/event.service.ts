import prisma from "@config/prisma";
import {
  CreateEventBody,
  EventModel,
  ById,
  GetEventsParams,
  PaginatedEventsResponse,
  UpdateEventBody,
  WithId,
  WithUserId,
} from "@familyflow/contracts";
import { alreadyExistError, notFoundError } from "@utils";

class EventServices {
  async getUserEvents({
    userId,
    page,
  }: WithUserId<GetEventsParams>): Promise<PaginatedEventsResponse> {
    const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
    const where = {
      OR: [{ userId }, { sharedWith: { some: { recipientId: userId } } }],
    };

    const events = await prisma.event.findMany({
      where,
      skip: page ? Number(page - 1) * itemsPerPage : 0,
      take: itemsPerPage,
      orderBy: [{ title: "asc" }],
    });

    const total = await prisma.event.count({ where });

    return {
      data: events,
      pagination: {
        total,
        page: page || 1,
        limit: itemsPerPage,
        totalPages: Math.ceil(total / itemsPerPage),
      },
    };
  }

  async getEventById({ id }: ById): Promise<EventModel> {
    const event = await prisma.event.findFirst({ where: { id } });

    if (!event) {
      throw notFoundError("Event not found");
    }

    return event;
  }

  async createEvent({
    userId,
    title,
    color = "",
    date = new Date(),
    repeatability = "day",
  }: WithUserId<CreateEventBody>): Promise<EventModel> {
    const haveEvent = await prisma.event.findFirst({
      where: { userId, title, color, date },
    });

    if (haveEvent) {
      throw alreadyExistError("Event already exists");
    }

    const newEvent = await prisma.event.create({
      data: { userId, title, color, date, repeatability },
    });

    return newEvent;
  }

  async updateEvent({
    id,
    title,
    color,
    date,
    repeatability,
  }: WithId<UpdateEventBody>): Promise<EventModel> {
    const haveEvent = await prisma.event.findFirst({
      where: { id },
    });

    if (!haveEvent) {
      throw notFoundError("Event not found");
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { title, color, date, repeatability },
    });

    return updatedEvent;
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
