import { getAllCollections } from '@/lib/placeholder/collections';
import { CollectionGrid } from '@/components/collections/CollectionGrid';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';

export default async function CollectionsPage() {
  // Fetch collections (using placeholder data for now)
  const collections = getAllCollections();

  return (
    <div className='container mx-auto px-4 nb-padding'>
      {/* Page Header */}
      <div className='mb-12 text-center space-y-4'>
        <Text variant='hd-xxl' className={`fade-in-from-top ${getDelayClass(0)}`}>
          Collections
        </Text>
        <Text
          variant='bd-lg'
          className={`text-muted-foreground max-w-2xl mx-auto fade-in-from-top
            ${getDelayClass(1)}`}
        >
          Explore our portfolio of events, series, and video projects. Each collection
          tells a unique story through professional photography.
        </Text>
      </div>

      {/* Collections Grid */}
      <div className={`fade-in-from-bottom ${getDelayClass(2)}`}>
        <CollectionGrid collections={collections} />
      </div>
    </div>
  );
}
