export const collectionsQueryKeys = {
  all: ['collections'] as const,
  list: () => [...collectionsQueryKeys.all, 'list'] as const,
  byType: (type: string) => [...collectionsQueryKeys.all, 'type', type] as const,
  bySlug: (slug: string) => [...collectionsQueryKeys.all, 'slug', slug] as const,
};
