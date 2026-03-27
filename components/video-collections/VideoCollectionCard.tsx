'use client';

import Link from 'next/link';
import { VideoCollectionWithVideos } from '@/lib/types/database';
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
import { Calendar, Globe, MapPin, Trash2, GlobeLock, Edit, ImageOff } from 'lucide-react';
import { cn } from '@/lib';
import { Button } from '@/components/animate-ui/components/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { useAuth } from '@/hooks/use-auth';

interface VideoCollectionCardProps {
  videoCollection: VideoCollectionWithVideos;
  className?: string;
  onEdit?: (videoCollection: VideoCollectionWithVideos) => void;
  onDelete?: (videoCollectionId: string) => void;
  onPublish?: (videoCollectionId: string) => void;
}

export function VideoCollectionCard({
  videoCollection,
  className,
  onEdit,
  onDelete,
  onPublish,
}: VideoCollectionCardProps) {
  const { isAuthenticated } = useAuth();
  const formattedDate = videoCollection.date
    ? new Date(videoCollection.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(videoCollection);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(videoCollection.id);
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPublish?.(videoCollection.id);
  };

  return (
    <Link
      href={`/video-collections/${videoCollection.slug}`}
      className='group block h-full'
    >
      <Card
        className={cn(
          'h-full flex flex-col overflow-hidden transition-all hover:shadow-lg pt-0',
          className
        )}
      >
        {/* Cover Image */}
        <div className='relative aspect-4/3 overflow-hidden bg-muted'>
          {videoCollection.cover_image ? (
            <OptimizedImage
              src={videoCollection.cover_image}
              alt={videoCollection.title}
              fill
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

          {/* Admin Actions */}
          {isAuthenticated && (
            <div className='absolute top-3 right-3 flex gap-2'>
              <div className='flex flex-row gap-2'>
                <Button variant='secondary' size='icon' onClick={handleEdit}>
                  <Edit />
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={videoCollection.is_published ? 'secondary' : 'default'}
                      size='icon'
                      onClick={handlePublish}
                    >
                      {videoCollection.is_published ? <Globe /> : <GlobeLock />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {videoCollection.is_published
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
        <CardHeader>
          <CardTitle>
            <Text variant='bd-sm'>{videoCollection.title}</Text>
          </CardTitle>
          <CardDescription>
            <Text variant='caption'>{videoCollection.description}</Text>
          </CardDescription>
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
          {videoCollection.location && (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <MapPin className='size-4' />
              <Text variant='bd-sm'>{videoCollection.location}</Text>
            </div>
          )}

          {/* Type badge */}
          <Badge className='capitalize'>
            <Text variant='bd-xs'>Video Collection</Text>
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
