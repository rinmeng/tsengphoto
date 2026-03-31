import { CollectionWithImages } from '@/lib/types/database';
import { getDelayClass } from '@/utils/animations';
import { ArrowLeft, ImageOff, Search } from 'lucide-react';
import { EmptyState } from '../EmptyState';
import { CollectionCard } from './CollectionCard';

interface CollectionGridProps {
  collections: CollectionWithImages[];
  onEdit?: (collection: CollectionWithImages) => void;
  onDelete?: (collectionId: string) => void;
  onPublish?: (collectionId: string) => void;
  isFiltered?: boolean;
}

export function CollectionGrid({
  collections,
  onEdit,
  onDelete,
  onPublish,
  isFiltered = false,
}: CollectionGridProps) {
  if (collections.length === 0) {
    return (
      <div className='container mx-auto fade-in-from-top h-[50vh]'>
        <EmptyState
          className='h-full'
          bordered={true}
          icon={isFiltered ? Search : ImageOff}
          title={isFiltered ? 'No results found' : `There's nothing here`}
          description={
            isFiltered
              ? 'Try adjusting your search to find what you are looking for.'
              : 'Come back later when we have some collections to show!'
          }
          buttonIcon={isFiltered ? undefined : ArrowLeft}
        />
      </div>
    );
  }

  return (
    <div className='container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {collections.map((collection, index) => (
        <CollectionCard
          className={`h-full fade-in-from-bottom ${getDelayClass(index)}`}
          key={collection.id}
          collection={collection}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublish={onPublish}
        />
      ))}
    </div>
  );
}
