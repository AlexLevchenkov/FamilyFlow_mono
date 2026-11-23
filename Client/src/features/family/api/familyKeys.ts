export const familyKeys = {
  all: ['family'] as const,
  my: () => [...familyKeys.all, 'my'] as const,
  detail: (id: number) => [...familyKeys.all, 'detail', id] as const,
  members: (id: number) => [...familyKeys.all, 'members', id] as const,
};
