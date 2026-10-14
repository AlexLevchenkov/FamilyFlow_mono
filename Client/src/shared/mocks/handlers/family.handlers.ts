import { mockDb } from '../mockDb';
import { err, ok } from './types';
import type { MockRequestContext, MockResponseResult } from './types';

export const familyHandlers = {
  getFamily(): MockResponseResult {
    return ok(mockDb.getFamily(1));
  },

  addMember(ctx: MockRequestContext): MockResponseResult {
    const email = String(ctx.body?.email ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return err('A valid email is required', 400);
    }
    const result = mockDb.addFamilyMember(1, email);
    if (result.error) return err(result.error, result.status);
    return ok(result.member, 201);
  },
};
