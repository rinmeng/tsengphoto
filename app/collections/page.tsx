import { CollectionsPageContent } from '@/components/collections/CollectionsPageContent';
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
    'Explore our portfolio of events, series, and video projects. Each collection tells a unique story through professional photography.';
  let ogImage = '/landing/carousel/carousel_1.jpg';

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
        .select('cover_image_url')
        .eq('collection_group_id', groupData.id)
        .eq('is_published', true)
        .not('cover_image_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1);

      if (collections?.[0]?.cover_image_url) {
        ogImage = collections[0].cover_image_url;
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
    title: `${title} | Tseng Photography`,
    description,
    openGraph: {
      title: `${title} | Tseng Photography`,
      description,
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
  };
}

export default function CollectionsPage() {
  return (
    <CollectionsPageContent
      title='Collections'
      description='Explore our portfolio of events, series, and video projects. Each collection tells a unique story through professional photography.'
      addButtonText='Add New Collection'
      countLabel='collections'
      itemTypeName='collection'
      showGroupsAndUnique={true}
    />
  );
}
