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
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui';
import { Text } from '@/components/Text';
import {
  Calendar,
  Globe,
  MapPin,
  Trash2,
  GlobeLock,
  Edit,
  ImageOff,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib';
import { Button } from '@/components/animate-ui/components/button';

interface CollectionCardProps {
  collection: CollectionWithImages;
  className?: string;
  isAuthenticated?: boolean;
  onEdit?: (collection: CollectionWithImages) => void;
  onDelete?: (collectionId: string) => void;
  onPublish?: (collectionId: string) => void;
}

export function CollectionCard({
  collection,
  className,
  isAuthenticated = false,
  onEdit,
  onDelete,
  onPublish,
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

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPublish?.(collection.id);
  };

  return (
    <Link href={`/collections/${collection.slug}`} className='group block h-full'>
      <Card
        className={cn(
          'h-full flex flex-col overflow-hidden transition-all hover:shadow-lg pt-0',
          className
        )}
      >
        {/* Cover Image */}
        <div className='relative aspect-4/3 overflow-hidden bg-muted'>
          {collection.cover_image ? (
            <Image
              src={collection.cover_image}
              alt={collection.title}
              fill
              className='object-cover transition-transform group-hover:scale-105'
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
            <div
              onClick={(e) => e.stopPropagation()}
              className='absolute top-3 right-3 flex gap-4 items-center border
                rounded-full py-2 px-6 bg-secondary/20 backdrop-blur-sm'
            >
              <ShieldCheck className='size-8 text-green-400' />
              <div className='flex gap-2'>
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
            </div>
          )}
        </div>

        {/* Card Content */}
        <CardHeader>
          <CardTitle>
            <Text variant='bd-sm'>{collection.title}</Text>
          </CardTitle>
          <CardDescription>
            <Text variant='caption'>{collection.description}</Text>
          </CardDescription>
          <Badge variant='outline'>
            <Text variant='bd-sm'>
              {imageCount} {imageCount === 1 ? 'photo' : 'photos'}
            </Text>
          </Badge>
        </CardHeader>

        <CardContent className='space-y-2'>
          {/* Date */}
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Calendar className='size-4' />
            <Text variant='bd-sm'>
              {formattedDate ? formattedDate : 'No date available'}
            </Text>
          </div>

          {/* Location */}
          <div className='flex items-center gap-2 text-muted-foreground'>
            <MapPin className='size-4' />
            <Text variant='bd-sm'>
              {collection.location ? collection.location : 'No location available'}
            </Text>
          </div>

          {/* Type badge */}
          <Badge className='capitalize'>
            <Text variant='bd-xs'>{collection.type}</Text>
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
