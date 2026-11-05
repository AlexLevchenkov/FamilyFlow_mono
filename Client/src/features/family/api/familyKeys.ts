export const familyKeys = {
  all: ['family'] as const,
  my: () => [...familyKeys.all, 'my'] as const,
  member: (id: string) => [...familyKeys.all, 'member', id] as const,
};
