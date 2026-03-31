export const collectionGroupsQueryKeys = {
  all: ['collection-groups'] as const,
  list: () => [...collectionGroupsQueryKeys.all, 'list'] as const,
};
