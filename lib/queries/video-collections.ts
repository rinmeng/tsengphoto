export const videoCollectionsQueryKeys = {
  all: ['video-collections'] as const,
  list: () => [...videoCollectionsQueryKeys.all, 'list'] as const,
  bySlug: (slug: string) => [...videoCollectionsQueryKeys.all, 'slug', slug] as const,
};

export const videosQueryKeys = {
  all: ['videos'] as const,
  byCollection: (collectionId: string) =>
    [...videosQueryKeys.all, 'collection', collectionId] as const,
};
