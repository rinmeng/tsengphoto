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
import { Calendar, MapPin } from 'lucide-react';

interface CollectionCardProps {
  collection: CollectionWithImages;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const imageCount = collection.images.length;
  const formattedDate = collection.date
    ? new Date(collection.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <Link href={`/collections/${collection.slug}`} className='group block'>
      <Card
        className='overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1
          pt-0'
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
          {/* Image count badge */}
          <Badge className='absolute top-3 right-3 bg-primary/50 backdrop-blur-sm'>
            <Text variant='bd-sm' className='font-medium'>
              {imageCount} {imageCount === 1 ? 'photo' : 'photos'}
            </Text>
          </Badge>
        </div>

        {/* Card Content */}
        <CardHeader>
          <CardTitle>{collection.title || collection.name}</CardTitle>
          <CardDescription>
            {collection.description || 'No description available'}
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
