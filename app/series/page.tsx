import { getCollectionsByType } from '@/lib/placeholder/collections';
import { CollectionGrid } from '@/components/collections/CollectionGrid';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';

export default async function SeriesPage() {
  const collections = getCollectionsByType('series');

  return (
    <div className='container mx-auto px-4 nb-padding'>
      {/* Page Header */}
      <div className='mb-12 text-center space-y-4'>
        <Text variant='hd-xxl' className={`fade-in-from-top ${getDelayClass(0)}`}>
          Series
        </Text>
        <Text
          variant='bd-lg'
          className={`text-muted-foreground max-w-2xl mx-auto fade-in-from-top
            ${getDelayClass(1)}`}
        >
          Ongoing photography projects and thematic collections. From mountain adventures
          to urban landscapes, each series tells a unique visual story.
        </Text>
      </div>

      {/* Series Grid */}
      <div className={`fade-in-from-bottom ${getDelayClass(2)}`}>
        <CollectionGrid collections={collections} />
      </div>
    </div>
  );
}
