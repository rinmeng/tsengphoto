import { getCollectionsByType } from '@/lib/placeholder/collections';
import { CollectionGrid } from '@/components/collections/CollectionGrid';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';

export default async function EventsPage() {
  const collections = getCollectionsByType('event');

  return (
    <div className='container mx-auto px-4 pb-4 nb-padding'>
      {/* Page Header */}
      <div className='mb-12 text-center space-y-4'>
        <Text variant='hd-xxl' className={`fade-in-from-top ${getDelayClass(0)}`}>
          Events
        </Text>
        <Text
          variant='bd-lg'
          className={`text-muted-foreground max-w-2xl mx-auto fade-in-from-top
            ${getDelayClass(1)}`}
        >
          Capturing life's special moments - from weddings and corporate gatherings to
          family portraits and workshops. Browse our event photography portfolio.
        </Text>
      </div>

      {/* Events Grid */}
      <div className={`fade-in-from-bottom ${getDelayClass(2)}`}>
        <CollectionGrid collections={collections} />
      </div>
    </div>
  );
}
