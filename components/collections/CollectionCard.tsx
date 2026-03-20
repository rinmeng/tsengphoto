import Link from 'next/link';
import Image from 'next/image';
import { CollectionWithImages } from '@/lib/types/database';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { Text } from '@/components/Text';
import { Calendar, MapPin, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib';
import { Button } from '@/components/animate-ui/components/button';

interface CollectionCardProps {
  collection: CollectionWithImages;
  className?: string;
  isAuthenticated?: boolean;
  onEdit?: (collection: CollectionWithImages) => void;
  onDelete?: (collectionId: string) => void;
}

export function CollectionCard({
  collection,
  className,
  isAuthenticated = false,
  onEdit,
  onDelete,
}: CollectionCardProps) {
  const imageCount = collection.images.length;
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

  return (
    <Link href={`/collections/${collection.slug}`} className='group block h-full'>
      <Card
        className={cn(
          `h-full flex flex-col overflow-hidden transition-all hover:shadow-lg
          hover:-translate-y-1 pt-0`,
          !collection.is_published && 'opacity-70',
          className
        )}
      >
        {/* Cover Image */}
        <div className='relative aspect-4/3 overflow-hidden bg-muted'>
          {collection.cover_image ? (
            <Image
              src={collection.cover_image}
              alt={collection.title || collection.name}
              fill
              className='object-cover transition-transform group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          ) : (
            <div className='flex h-full items-center justify-center'>
              <Text variant='muted'>No cover image</Text>
            </div>
          )}

          {/* Admin Actions - Top Left */}
          {isAuthenticated && (
            <div className='absolute top-3 left-3 flex gap-2'>
              <Button
                variant='secondary'
                size='icon'
                className='h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background'
                onClick={handleEdit}
              >
                <Pencil className='h-4 w-4' />
              </Button>
              <Button
                variant='destructive'
                size='icon'
                className='h-8 w-8 bg-destructive/80 backdrop-blur-sm
                  hover:bg-destructive'
                onClick={handleDelete}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          )}

          {/* Badges - Top Right */}
          <div className='absolute top-3 right-3 flex flex-col gap-2 items-end'>
            <Badge>
              <Text variant='bd-sm' className='font-medium'>
                {imageCount} {imageCount === 1 ? 'photo' : 'photos'}
              </Text>
            </Badge>
            {!collection.is_published && (
              <Badge variant='secondary'>
                <Text variant='bd-sm' className='font-medium'>
                  Not Published
                </Text>
              </Badge>
            )}
          </div>
        </div>

        {/* Card Content */}
        <CardHeader>
          <CardTitle>{collection.title || collection.name}</CardTitle>
          <CardDescription>{collection.description}</CardDescription>
        </CardHeader>

        <CardContent className='space-y-2'>
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
        </CardContent>
      </Card>
    </Link>
  );
}
