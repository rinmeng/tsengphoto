import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCollectionBySlug, getAllCollections } from '@/lib/placeholder/collections';
import { Text } from '@/components/Text';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge, Button } from '@/components/ui';
import { getDelayClass } from '@/utils/animations';
import { CollectionImageViewer } from './components/CollectionImageViewer';
import { Footer } from '@/components/Footer';

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
    <div>
      <section
        className='container border-x-2 border-dashed mx-auto pb-4 px-4 nb-padding
          min-h-screen'
      >
        {/* Back Button */}
        <div className={`sticky top-20 mb-6 z-50 fade-in-from-right ${getDelayClass(0)}`}>
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

        {/* Image Gallery with Viewer */}
        <CollectionImageViewer
          images={collection.images}
          collectionTitle={collection.title || collection.name}
        />
      </section>
      <Footer />
    </div>
  );
}
