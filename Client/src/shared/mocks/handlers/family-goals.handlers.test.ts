import { beforeEach, describe, expect, it } from 'vitest';
import { mockDb } from '../mockDb';
import { familyHandlers } from './family.handlers';
import { goalHandlers } from './goal.handlers';
import type { MockRequestContext } from './types';

function context(
  body?: Record<string, unknown>,
  id?: string
): MockRequestContext {
  return {
    url: '',
    method: '',
    params: id ? { id } : {},
    query: {},
    body,
  };
}

describe('family and goal mock handlers', () => {
  beforeEach(() => mockDb.reset());

  it('does not create a family member for an unregistered email', () => {
    const result = familyHandlers.addMember(
      context({ email: 'unknown@example.com' })
    );

    expect(result.status).toBe(404);
    expect(mockDb.getFamily(1).members).toHaveLength(4);
  });

  it('adds only an existing account to the family', () => {
    mockDb.createUser('new-member@example.com', 'New Member');
    const result = familyHandlers.addMember(
      context({ email: 'new-member@example.com' })
    );

    expect(result.status).toBe(201);
    expect(mockDb.getFamily(1).members).toHaveLength(5);
  });

  it('persists goal creation and updates through the mock API', () => {
    const created = goalHandlers.createGoal(
      context({ title: 'New goal', category: 'Home' })
    );
    const goal = created.data.data as { id: number; progress: number };

    expect(created.status).toBe(201);
    expect(
      goalHandlers.updateGoal(context({ progress: 50 }, String(goal.id))).status
    ).toBe(200);
    expect(mockDb.getGoals(1).find(item => item.id === goal.id)?.progress).toBe(
      50
    );
    expect(
      goalHandlers.deleteGoal(context(undefined, String(goal.id))).status
    ).toBe(200);
    expect(mockDb.getGoals(1)).toHaveLength(3);
  });
});
