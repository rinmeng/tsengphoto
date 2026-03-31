'use client';

import { OptimizedImage } from '@/components/OptimizedImage';
import { Text } from '@/components/Text';
import { Badge, Card, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib';
import { CollectionWithImages } from '@/lib/types/database';
import { scrollToTop } from '@/utils/scroll';
import { Folder, ImageOff } from 'lucide-react';

interface CollectionGroupCardProps {
  groupName: string;
  collections: CollectionWithImages[];
  className?: string;
  onClick?: () => void;
}

export function CollectionGroupCard({
  groupName,
  collections,
  className,
  onClick,
}: CollectionGroupCardProps) {
  // Get the first collection's cover image for the group card
  const firstCollection = collections[0];
  const coverImage = firstCollection?.cover_image;

  const handleClick = () => {
    scrollToTop();
    onClick?.();
  };

  return (
    <div onClick={handleClick} className='cursor-pointer group block h-full'>
      <Card
        className={cn(
          'h-full flex flex-col overflow-hidden transition-all hover:shadow-lg pt-0 gap-4',
          className
        )}
      >
        {/* Cover Image */}
        <div className='relative aspect-4/3 overflow-hidden bg-muted'>
          {coverImage ? (
            <OptimizedImage
              src={coverImage}
              alt={groupName}
              fill
              loading='lazy'
              className='object-cover object-[center_20%] transition-transform
                group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          ) : (
            <div
              className='flex h-full flex-col items-center justify-center gap-2
                text-center'
            >
              <ImageOff className='w-12 h-12 text-muted-foreground' />
              <Text variant='muted'>No cover image</Text>
            </div>
          )}

          {/* Group Badge - Top Left */}
          <div className='absolute top-3 left-3'>
            <Badge variant='secondary' className='flex items-center gap-1'>
              <Folder className='size-3' />
              Group
            </Badge>
          </div>
        </div>

        {/* Card Content */}
        <CardHeader className='flex flex-col gap-2'>
          <CardTitle>
            <Text variant='bd-md'>{groupName}</Text>
          </CardTitle>
          <CardDescription>
            <Text variant='caption'>
              {collections.length}{' '}
              {collections.length === 1 ? 'collection' : 'collections'}
            </Text>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
