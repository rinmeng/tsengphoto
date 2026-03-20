'use client';

import { getAllCollections } from '@/lib/placeholder/collections';
import { CollectionGrid } from '@/components/collections/CollectionGrid';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';
import { useQuery } from '@tanstack/react-query';
import { collectionsQueryKeys } from '@/lib/queries/collections';
import { Skeleton } from '@/components/ui';

export default function CollectionsPage() {
  const { data: collections = [], isLoading } = useQuery({
    queryKey: collectionsQueryKeys.list(),
    queryFn: async () => getAllCollections(),
  });

  return (
    <div className='container mx-auto px-4 pb-4 nb-padding'>
      {/* Page Header */}
      <div className='mb-12 text-center space-y-4'>
        <Text variant='hd-xxl' className={`fade-in-from-bottom ${getDelayClass(0)}`}>
          Collections
        </Text>
        <Text
          variant='bd-lg'
          className={`text-muted-foreground max-w-2xl mx-auto fade-in-from-bottom
            ${getDelayClass(1)}`}
        >
          Explore our portfolio of events, series, and video projects. Each collection
          tells a unique story through professional photography.
        </Text>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className='h-80 w-full' />
          ))}
        </div>
      ) : (
        <CollectionGrid collections={collections} />
      )}
    </div>
  );
}
