import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const group = params.group as string | undefined;
  const type = params.type as string | undefined;
  const q = params.q as string | undefined;

  let title = 'Collections';
  let description =
    'Browse my collection of event photography, video projects, and photo series. Professional photography services in Vancouver and Kelowna.';
  let ogImage = '/landing/carousel/carousel_1.jpg';
  const url = 'https://tsengphoto.vercel.app/collections';

  if (group) {
    const groupName = decodeURIComponent(group.replace(/\+/g, ' '));
    title = `${groupName} Collections`;
    description = `Browse the ${groupName} collection.`;

    // Fetch first collection from this group for cover image
    const supabase = await createClient();

    // First, get the collection group ID
    const { data: groupData } = await supabase
      .from('collection_groups')
      .select('id')
      .eq('name', groupName)
      .single();

    if (groupData?.id) {
      // Now fetch collections from this group
      const { data: collections } = await supabase
        .from('collections')
        .select('cover_image')
        .eq('collection_group_id', groupData.id)
        .eq('is_published', true)
        .not('cover_image', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1);

      if (collections?.[0]?.cover_image) {
        ogImage = collections[0].cover_image;
      }
    }
  } else if (type) {
    const typeName = decodeURIComponent(type.replace(/\+/g, ' '));
    title = `${typeName.charAt(0).toUpperCase() + typeName.slice(1)} Collections`;
    description = `Explore our ${typeName} photography collections.`;
  } else if (q) {
    const searchQuery = decodeURIComponent(q.replace(/\+/g, ' '));
    title = `Search: ${searchQuery}`;
    description = `Search results for "${searchQuery}" in our photography collections.`;
  }

  return {
    metadataBase: new URL('https://tsengphoto.vercel.app'),
    title: `${title} | Tseng Photography`,
    description,
    keywords: [
      'photography collections',
      'event photography',
      'photo series',
      'Vancouver photographer',
      'Kelowna photographer',
      'photography portfolio',
      'professional photography',
      'photo gallery',
    ],
    openGraph: {
      title: `${title} | Tseng Photography`,
      description,
      url,
      siteName: 'Tseng Photography',
      type: 'website',
      locale: 'en_CA',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Tseng Photography`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: '/collections',
    },
  };
}

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
