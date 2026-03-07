import { CollectionWithImages } from '@/lib/types/database';
import { CollectionCard } from './CollectionCard';
import { getDelayClass } from '@/utils/animations';
import { EmptyState } from '../EmptyState';
import { ArrowLeft, ImageOff } from 'lucide-react';

interface CollectionGridProps {
  collections: CollectionWithImages[];
}

export function CollectionGrid({ collections }: CollectionGridProps) {
  if (collections.length === 0) {
    return (
      <div className='container mx-auto fade-in-from-top h-screen'>
        <EmptyState
          className='h-2/3'
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
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {collections.map((collection, index) => (
        <CollectionCard
          className={`fade-in-from-top ${getDelayClass(index)}`}
          key={collection.id}
          collection={collection}
        />
      ))}
    </div>
  );
}
