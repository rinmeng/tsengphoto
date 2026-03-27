'use client';

import Link from 'next/link';
import { CollectionWithImages } from '@/lib/types/database';
import {
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  CardFooter,
} from '@/components/ui';
import { Text } from '@/components/Text';
import { Calendar, Globe, MapPin, Trash2, GlobeLock, Edit, ImageOff } from 'lucide-react';
import { cn } from '@/lib';
import { Button } from '@/components/animate-ui/components/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { useAuth } from '@/hooks/use-auth';

interface CollectionCardProps {
  collection: CollectionWithImages;
  className?: string;
  onEdit?: (collection: CollectionWithImages) => void;
  onDelete?: (collectionId: string) => void;
  onPublish?: (collectionId: string) => void;
}

export function CollectionCard({
  collection,
  className,
  onEdit,
  onDelete,
  onPublish,
}: CollectionCardProps) {
  const { isAuthenticated } = useAuth();
  const formattedDate = collection.date
    ? new Date(collection.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(collection);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(collection.id);
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPublish?.(collection.id);
  };

  return (
    <Link href={`/collections/${collection.slug}`} className='group block h-full'>
      <Card
        className={cn(
          'h-full flex flex-col overflow-hidden transition-all hover:shadow-lg pt-0 gap-4',
          className
        )}
      >
        {/* Cover Image */}
        <div className='relative aspect-4/3 overflow-hidden bg-muted'>
          {collection.cover_image ? (
            <OptimizedImage
              src={collection.cover_image}
              alt={collection.title}
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

          {/* Admin Actions - Top Left */}
          {isAuthenticated && (
            <div className='absolute top-3 right-3 flex gap-2'>
              <div className='flex flex-row gap-2'>
                <Button variant='secondary' size='icon' onClick={handleEdit}>
                  <Edit />
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={collection.is_published ? 'secondary' : 'default'}
                      size='icon'
                      onClick={handlePublish}
                    >
                      {collection.is_published ? <Globe /> : <GlobeLock />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {collection.is_published
                      ? 'Collection is published. Click to unpublish.'
                      : 'Collection is not published. Click to publish.'}
                  </TooltipContent>
                </Tooltip>
                <Button variant='destructive' size='icon' onClick={handleDelete}>
                  <Trash2 />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Card Content */}
        <CardHeader className='flex flex-col gap-0'>
          <CardTitle>
            <Text variant='bd-sm'>{collection.title}</Text>
          </CardTitle>
          <CardDescription>
            <Text variant='caption'>{collection.description}</Text>
          </CardDescription>
        </CardHeader>

        <CardFooter className='flex flex-col gap-2 justify-end items-start flex-1'>
          {/* Date */}
          {formattedDate && (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Calendar className='size-4' />
              <Text variant='bd-sm'>{formattedDate}</Text>
            </div>
          )}

          {/* Location */}
          {collection.location && (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <MapPin className='size-4' />
              <Text variant='bd-sm'>{collection.location}</Text>
            </div>
          )}

          {/* Type badge */}
          <Badge className='capitalize'>
            <Text variant='bd-xs'>{collection.type}</Text>
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
