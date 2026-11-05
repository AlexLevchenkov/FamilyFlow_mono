import type { CreateTaskBody, TaskModel, UpdateTaskBody } from '@types';

export const INITIAL_TASK: TaskModel[] = [
  {
    id: 1,
    userId: 1,
    title: 'Купити молоко',
    type: 'home',
    visibility: 'shared',
    status: false,
    date: new Date('2026-10-23T10:00:00.000Z'),
    createdAt: new Date('2026-10-22T10:00:00.000Z'),
    updatedAt: new Date('2026-10-22T10:00:00.000Z'),
  },
  {
    id: 2,
    userId: 1,
    title: 'Полити квіти',
    type: 'home',
    visibility: 'shared',
    status: false,
    date: new Date('2026-10-23T11:00:00.000Z'),
    createdAt: new Date('2026-10-22T11:00:00.000Z'),
    updatedAt: new Date('2026-10-22T11:00:00.000Z'),
  },
  {
    id: 3,
    userId: 1,
    title: 'Вигуляти собаку',
    type: 'home',
    visibility: 'shared',
    status: false,
    date: new Date('2026-10-23T12:00:00.000Z'),
    createdAt: new Date('2026-10-22T12:00:00.000Z'),
    updatedAt: new Date('2026-10-22T12:00:00.000Z'),
  },
  {
    id: 4,
    userId: 1,
    title: 'Винести сміття',
    type: 'home',
    visibility: 'shared',
    status: false,
    date: new Date('2026-10-23T13:00:00.000Z'),
    createdAt: new Date('2026-10-22T13:00:00.000Z'),
    updatedAt: new Date('2026-10-22T13:00:00.000Z'),
  },
];

export class MockTaskDatabase {
  private tasks: TaskModel[] = [];
  private nextTaskId: number = 1;

  constructor() {
    this.reset();
  }

  public reset() {
    this.tasks = [...INITIAL_TASK];
    this.nextTaskId = INITIAL_TASK.length + 1;
  }

  public getTasks() {
    return this.tasks;
  }

  public getTaskById(id: number) {
    return this.tasks.find(task => task.id === id);
  }

  public createTask(task: CreateTaskBody) {
    const newTask: TaskModel = {
      id: this.nextTaskId++,
      userId: 1,
      title: task.title,
      type: task.type,
      visibility: task.visibility,
      status: false,
      date: task.date,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  public updateTask({
    id,
    title,
    type,
    visibility,
    status,
    date,
  }: UpdateTaskBody) {
    const task = this.getTaskById(id);
    if (!task) return;
    const updatedTask: TaskModel = {
      id,
      userId: task.userId,
      createdAt: task.createdAt,
      title: title || task.title,
      type: type || task.type,
      visibility: visibility || task.visibility,
      status: status !== undefined ? Boolean(status) : task.status,
      date: date !== undefined ? new Date(date) : task.date,
      updatedAt: new Date(),
    };
    this.tasks = this.tasks.map(task => (task.id === id ? updatedTask : task));

    return updatedTask;
  }

  public deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
}
