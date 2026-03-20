'use client';

import { getCollectionsByType } from '@/lib/placeholder/collections';
import { CollectionGrid } from '@/components/collections/CollectionGrid';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';
import { useQuery } from '@tanstack/react-query';
import { collectionsQueryKeys } from '@/lib/queries/collections';
import { Skeleton } from '@/components/ui';

export default function EventsPage() {
  const { data: collections = [], isLoading } = useQuery({
    queryKey: collectionsQueryKeys.byType('event'),
    queryFn: async () => getCollectionsByType('event'),
  });

  return (
    <div className='container mx-auto px-4 pb-4 nb-padding'>
      {/* Page Header */}
      <div className='mb-12 text-center space-y-4'>
        <Text variant='hd-xxl' className={`fade-in-from-bottom ${getDelayClass(0)}`}>
          Events
        </Text>
        <Text
          variant='bd-lg'
          className={`text-muted-foreground max-w-2xl mx-auto fade-in-from-bottom
            ${getDelayClass(1)}`}
        >
          Capturing life&apos;s special moments - from weddings and corporate gatherings
          to family portraits and workshops. Browse our event photography portfolio.
        </Text>
      </div>

      {/* Events Grid */}
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
