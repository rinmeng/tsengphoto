import { CollectionWithImages } from '@/lib/types/database';
import { CollectionCard } from './CollectionCard';

interface CollectionGridProps {
  collections: CollectionWithImages[];
}

export function CollectionGrid({ collections }: CollectionGridProps) {
  if (collections.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground'>No collections found</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
