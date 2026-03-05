import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCollectionBySlug, getAllCollections } from '@/lib/placeholder/collections';
import { Text } from '@/components/Text';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge, Button } from '@/components/ui';
import { getDelayClass } from '@/utils/animations';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return {
      title: 'Collection Not Found',
    };
  }

  return {
    title: `${collection.title || collection.name} | TsengPhoto`,
    description:
      collection.description || `View ${collection.title || collection.name} collection`,
    openGraph: {
      title: collection.title || collection.name,
      description: collection.description || undefined,
      type: 'website',
      images: collection.cover_image
        ? [
            {
              url: collection.cover_image,
              width: 1200,
              height: 630,
              alt: collection.title || collection.name,
            },
          ]
        : undefined,
    },
  };
}

// Generate static params for all collections (optional, for static generation)
export async function generateStaticParams() {
  const collections = getAllCollections();
  return collections.map((collection) => ({
    slug: collection.slug,
  }));
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const formattedDate = collection.date
    ? new Date(collection.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className='container mx-auto px-4 nb-padding'>
      {/* Back Button */}
      <div className={`sticky top-20 mb-6 z-60 fade-in-from-right ${getDelayClass(0)}`}>
        <Link href='/collections'>
          <Button variant='default'>
            <ArrowLeft />
            Back to Collections
          </Button>
        </Link>
      </div>

      {/* Collection Header */}
      <div className='mb-12 space-y-6 fade-in-from-top'>
        <div className='space-y-2'>
          <Badge className={`fade-in-from-top capitalize ${getDelayClass(1)}`}>
            <Text variant='bd-xs'>{collection.type}</Text>
          </Badge>
          <Text variant='hd-xxl' className={`fade-in-from-top ${getDelayClass(2)}`}>
            {collection.title || collection.name}
          </Text>
        </div>

        {collection.description && (
          <Text
            variant='bd-lg'
            className={`text-muted-foreground max-w-3xl fade-in-from-top
            ${getDelayClass(3)}`}
          >
            {collection.description}
          </Text>
        )}

        {/* Meta Information */}
        <div
          className={`flex flex-wrap gap-6 text-muted-foreground fade-in-from-top
            ${getDelayClass(4)}`}
        >
          {formattedDate && (
            <div className='flex items-center gap-2'>
              <Calendar className='size-5' />
              <Text variant='bd-md'>{formattedDate}</Text>
            </div>
          )}
          {collection.location && (
            <div className='flex items-center gap-2'>
              <MapPin className='size-5' />
              <Text variant='bd-md'>{collection.location}</Text>
            </div>
          )}
          <div className='flex items-center gap-2'>
            <Text variant='bd-md'>
              {collection.images.length}{' '}
              {collection.images.length === 1 ? 'photo' : 'photos'}
            </Text>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className='space-y-6'>
        {collection.images.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {collection.images
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((image, index) => (
                <div
                  key={image.id}
                  className={`relative overflow-hidden rounded-lg bg-muted
                    fade-in-from-bottom ${getDelayClass(index)} ${
                      index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                    }`}
                >
                  <div
                    className={`relative ${
                      index === 0 ? 'aspect-16/10' : 'aspect-square'
                      }`}
                  >
                    {image.image_url ? (
                      <Image
                        src={image.image_url}
                        alt={`${collection.title || collection.name} - Photo ${index + 1}`}
                        fill
                        className='object-cover hover:scale-105 transition-transform
                          duration-300'
                        sizes={
                          index === 0
                            ? '(max-width: 768px) 100vw, 66vw'
                            : '(max-width: 768px) 100vw, 33vw'
                        }
                      />
                    ) : (
                      <div className='flex h-full items-center justify-center'>
                        <Text variant='muted'>No image</Text>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <Text variant='muted'>No images in this collection</Text>
          </div>
        )}
      </div>
    </div>
  );
}
