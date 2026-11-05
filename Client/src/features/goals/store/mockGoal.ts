import type { CreateGoalBody, GoalModel, UpdateGoalBody, WithId } from '@types';

export const INITIAL_GOALS: GoalModel[] = [
  {
    id: 1,
    familyId: 1,
    createdById: 1,
    title: 'ПОїхати у відпустку',
    description: "Відпочити на морі всією сім'єю",
    type: 'AMOUNT',
    status: 'ACTIVE',
    currentValue: 0,
    targetValue: 100000,
    currency: 'UAH',
    unit: null,
    startsAt: new Date('2026-11-01T00:00:00.000Z'),
    dueDate: new Date('2026-12-31T23:59:59.999Z'),
    createdAt: new Date('2026-10-22T10:00:00.000Z'),
    updatedAt: new Date('2026-10-22T10:00:00.000Z'),
  },
  {
    id: 2,
    familyId: 1,
    createdById: 1,
    title: 'Пробігти марафон',
    description: 'Пробігти марафон 42.2 км',
    type: 'STEPS',
    status: 'ACTIVE',
    currentValue: 0,
    targetValue: 42.2,
    currency: null,
    unit: 'km',
    startsAt: new Date('2026-10-01T00:00:00.000Z'),
    dueDate: new Date('2027-04-30T23:59:59.999Z'),
    createdAt: new Date('2026-10-22T11:00:00.000Z'),
    updatedAt: new Date('2026-10-22T11:00:00.000Z'),
  },
  {
    id: 3,
    familyId: 1,
    createdById: 1,
    title: 'Прочитати 10 книг',
    description: 'Прочитати 10 книг за рік',
    type: 'COUNTER',
    status: 'ACTIVE',
    currentValue: 1,
    targetValue: 10,
    currency: null,
    unit: 'books',
    startsAt: new Date('2026-01-01T00:00:00.000Z'),
    dueDate: new Date('2026-12-31T23:59:59.999Z'),
    createdAt: new Date('2026-10-22T12:00:00.000Z'),
    updatedAt: new Date('2026-10-22T12:00:00.000Z'),
  },
];

export class MockGoalDatabase {
  private goals: GoalModel[] = [];
  private nextGoalId: number = 1;

  constructor() {
    this.reset();
  }

  public reset() {
    this.goals = [...INITIAL_GOALS];
    this.nextGoalId = INITIAL_GOALS.length + 1;
  }

  public getGoals(familyId?: number) {
    return this.goals.filter(goal => goal.familyId === familyId);
  }

  public getGoalById(id: number) {
    return this.goals.find(goal => goal.id === id);
  }

  public createGoal(goal: CreateGoalBody) {
    const newGoal: GoalModel = {
      id: this.nextGoalId++,
      familyId: 1,
      createdById: 1,
      title: goal.title,
      description: goal.description,
      type: goal.type,
      status: goal.status,
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      currency: goal.currency,
      unit: goal.unit,
      startsAt: goal.startsAt,
      dueDate: goal.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.goals.push(newGoal);
    return newGoal;
  }

  public updateGoal({
    id,
    title,
    description,
    status,
    currentValue,
    targetValue,
    unit,
    currency,
    dueDate,
  }: WithId<UpdateGoalBody>) {
    const goal = this.getGoalById(id);
    if (!goal) {
      return null;
    }
    const updatedGoal: GoalModel = {
      ...goal,
      title: title || goal.title,
      description: description || goal.description,
      status: status || goal.status,
      currentValue: currentValue || goal.currentValue,
      targetValue: targetValue || goal.targetValue,
      unit: unit || goal.unit,
      currency: currency || goal.currency,
      dueDate: dueDate || goal.dueDate,
      updatedAt: new Date(),
    };
    this.goals = this.goals.map(g => (g.id === id ? updatedGoal : g));
    return updatedGoal;
  }

  public deleteGoal(id: number) {
    this.goals = this.goals.filter(g => g.id !== id);
  }
}
