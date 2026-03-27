import { useMemo } from 'react';
import { CollectionWithImages } from '@/lib/types/database';
import { CollectionCard } from './CollectionCard';
import { getDelayClass } from '@/utils/animations';
import { EmptyState } from '../EmptyState';
import { ArrowLeft, ImageOff } from 'lucide-react';

interface CollectionGridProps {
  collections: CollectionWithImages[];
  onEdit?: (collection: CollectionWithImages) => void;
  onDelete?: (collectionId: string) => void;
  onPublish?: (collectionId: string) => void;
}

export function CollectionGrid({
  collections,
  onEdit,
  onDelete,
  onPublish,
}: CollectionGridProps) {
  // Sort collections by date (recent to old), extract year from title, then alphabetical
  const sortedCollections = useMemo(() => {
    const extractYear = (title: string): number | null => {
      const yearMatch = title.match(/\b(19\d{2}|20\d{2})\b/);
      return yearMatch ? parseInt(yearMatch[1], 10) : null;
    };

    return [...collections].sort((a, b) => {
      // Both have explicit dates - sort by date (newest first)
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      // Only a has date - a comes first
      if (a.date && !b.date) return -1;
      // Only b has date - b comes first
      if (!a.date && b.date) return 1;

      // Extract years from titles
      const yearA = extractYear(a.title);
      const yearB = extractYear(b.title);

      // Both have years in title - sort by year (newest first)
      if (yearA && yearB) {
        return yearB - yearA;
      }
      // Only a has year - a comes first
      if (yearA && !yearB) return -1;
      // Only b has year - b comes first
      if (!yearA && yearB) return 1;

      // Neither has date nor year - sort alphabetically (A-Z)
      return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
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
          onEdit={onEdit}
          onDelete={onDelete}
          onPublish={onPublish}
        />
      ))}
    </div>
  );
}
