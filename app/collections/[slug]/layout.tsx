import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';

interface CollectionLayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Fetch collection from database
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase.from('collections').select('*').eq('slug', slug);

  // Only filter by is_published for non-authenticated users
  if (!user) {
    query = query.eq('is_published', true);
  }

  const { data: collection } = await query.single();

  if (!collection) {
    return {
      title: 'Collection Not Found | Tseng Photography',
      description: 'The requested collection could not be found.',
    };
  }

  const title = `${collection.title} | Tseng Photography`;
  const description = collection.description || `View ${collection.title} collection`;
  const imageUrl = collection.cover_image || '/landing/carousel/carousel_1.jpg';
  const url = `https://tsengphoto.vercel.app/collections/${slug}`;

  return {
    metadataBase: new URL('https://tsengphoto.vercel.app'),
    title,
    description,
    keywords: [
      collection.title,
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
          alt: collection.title,
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
