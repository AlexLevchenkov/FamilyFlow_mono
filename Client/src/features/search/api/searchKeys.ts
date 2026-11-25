export const searchKeys = {
  all: ['global-search'] as const,
  query: (query: string) => [...searchKeys.all, query] as const,
};
