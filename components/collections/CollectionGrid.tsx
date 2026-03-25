import { useMemo } from 'react';
import { CollectionWithImages } from '@/lib/types/database';
import { CollectionCard } from './CollectionCard';
import { getDelayClass } from '@/utils/animations';
import { EmptyState } from '../EmptyState';
import { ArrowLeft, ImageOff } from 'lucide-react';

interface CollectionGridProps {
  collections: CollectionWithImages[];
  isAuthenticated?: boolean;
  onEdit?: (collection: CollectionWithImages) => void;
  onDelete?: (collectionId: string) => void;
  onPublish?: (collectionId: string) => void;
}

export function CollectionGrid({
  collections,
  isAuthenticated = false,
  onEdit,
  onDelete,
  onPublish,
}: CollectionGridProps) {
  // Sort collections by date (recent to old), fall back to created_at if no date
  const sortedCollections = useMemo(() => {
    return [...collections].sort((a, b) => {
      // Both have dates - sort by date
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      // Only a has date - a comes first
      if (a.date && !b.date) return -1;
      // Only b has date - b comes first
      if (!a.date && b.date) return 1;
      // Neither has date - sort by created_at
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [collections]);

  if (collections.length === 0) {
    return (
      <div className='container mx-auto fade-in-from-top h-[50vh]'>
        <EmptyState
          className='h-full'
          bordered={true}
          icon={ImageOff}
          title={`There's nothing here`}
          description='Come back later when we have some collections to show!'
          buttonIcon={ArrowLeft}
        />
      </div>
    );
  }

  return (
    <div className='container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {sortedCollections.map((collection, index) => (
        <CollectionCard
          className={`h-full fade-in-from-bottom ${getDelayClass(index)}`}
          key={collection.id}
          collection={collection}
          isAuthenticated={isAuthenticated}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublish={onPublish}
        />
      ))}
    </div>
  );
}
