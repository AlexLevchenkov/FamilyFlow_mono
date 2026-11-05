import { MockEventsDatabase } from '@features/event/store/mockEvent';
import { MockFamilyDatabase } from '@features/family/store/mockFamily';
import { MockGoalDatabase } from '@features/goals/store/mockGoal';
import { MockTaskDatabase } from '@features/tasks/store/mockTask';
import { MockUserDatabase } from '@features/user/store/mockUser';

class MockDatabase {
  public events: MockEventsDatabase;
  public families: MockFamilyDatabase;
  public goals: MockGoalDatabase;
  public tasks: MockTaskDatabase;
  public users: MockUserDatabase;

  constructor() {
    this.events = new MockEventsDatabase();
    this.families = new MockFamilyDatabase();
    this.goals = new MockGoalDatabase();
    this.tasks = new MockTaskDatabase();
    this.users = new MockUserDatabase();
  }

  public reset() {
    this.events.reset();
    this.families.reset();
    this.goals.reset();
    this.tasks.reset();
    this.users.reset();
  }
}

export const mockDb = new MockDatabase();
