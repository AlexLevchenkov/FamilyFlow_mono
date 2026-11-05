import type {
  CreateEventBody,
  EventModel,
  UpdateEventBody,
  WithId,
} from '@types';

export const INITIAL_EVENTS: EventModel[] = [
  {
    id: 1,
    userId: 1,
    title: 'Купити молоко',
    color: 'blue',
    date: new Date('2026-10-23T10:00:00.000Z'),
    repeatability: 'day',
    createdAt: new Date('2026-10-22T10:00:00.000Z'),
    updatedAt: new Date('2026-10-22T10:00:00.000Z'),
  },
  {
    id: 2,
    userId: 1,
    title: 'Полити квіти',
    color: 'green',
    date: new Date('2026-10-23T11:00:00.000Z'),
    repeatability: 'week',
    createdAt: new Date('2026-10-22T11:00:00.000Z'),
    updatedAt: new Date('2026-10-22T11:00:00.000Z'),
  },
  {
    id: 3,
    userId: 1,
    title: 'Вигуляти собаку',
    color: 'red',
    date: new Date('2026-10-23T12:00:00.000Z'),
    repeatability: 'month',
    createdAt: new Date('2026-10-22T12:00:00.000Z'),
    updatedAt: new Date('2026-10-22T12:00:00.000Z'),
  },
  {
    id: 4,
    userId: 1,
    title: 'Винести сміття',
    color: 'yellow',
    date: new Date('2026-10-23T13:00:00.000Z'),
    repeatability: 'year',
    createdAt: new Date('2026-10-22T13:00:00.000Z'),
    updatedAt: new Date('2026-10-22T13:00:00.000Z'),
  },
];

export class MockEventsDatabase {
  private events: EventModel[] = [];
  private nextEventId: number = 1;

  constructor() {
    this.reset();
  }

  public reset() {
    this.events = [...INITIAL_EVENTS];
    this.nextEventId = INITIAL_EVENTS.length + 1;
  }

  public getEvents() {
    return this.events;
  }

  public getEventById(id: number) {
    return this.events.find(event => event.id === id);
  }

  public createEvent({ title, color, date, repeatability }: CreateEventBody) {
    const event: EventModel = {
      id: this.nextEventId++,
      userId: 1,
      title,
      color,
      date,
      repeatability,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.events.push(event);
  }

  public updateEvent({
    id,
    title,
    color,
    date,
    repeatability,
  }: WithId<UpdateEventBody>) {
    const event = this.getEventById(id);
    if (!event) return null;

    event.title = title;
    event.color = color;
    event.date = date;
    event.repeatability = repeatability;
    event.updatedAt = new Date();
  }

  public deleteEvent(id: number) {
    this.events = this.events.filter(event => event.id !== id);
  }
}
