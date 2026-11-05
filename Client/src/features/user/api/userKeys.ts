export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  userById: (id: number) => [...userKeys.all, 'user', id] as const,
};
