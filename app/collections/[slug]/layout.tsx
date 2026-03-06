import type { Metadata } from 'next';
import { getCollectionBySlug } from '@/lib/placeholder/collections';

interface CollectionLayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return {
      title: 'Collection Not Found | Tseng Photography',
      description: 'The requested collection could not be found.',
    };
  }

  const title = `${collection.title || collection.name} | Tseng Photography`;
  const description =
    collection.description || `View ${collection.title || collection.name} collection`;
  const imageUrl = collection.cover_image || '/landing/carousel/carousel_1.jpg';
  const url = `https://tsengphoto.vercel.app/collections/${slug}`;

  return {
    metadataBase: new URL('https://tsengphoto.vercel.app'),
    title,
    description,
    keywords: [
      collection.title || collection.name,
      collection.type,
      'photography collection',
      'event photography',
      'Vancouver photographer',
      'Kelowna photographer',
      'professional photography',
      'photo gallery',
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: 'Tseng Photography',
      type: 'website',
      locale: 'en_CA',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: collection.title || collection.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/collections/${slug}`,
    },
  };
}

export default async function CollectionLayout({ children }: CollectionLayoutProps) {
  return <>{children}</>;
}
