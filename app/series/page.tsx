import { CollectionsPageContent } from '@/components/collections/CollectionsPageContent';
import type { Metadata } from 'next';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q as string | undefined;

  let title = 'Series';
  let description =
    'Ongoing photography projects and thematic collections. From mountain adventures to urban landscapes, each series tells a unique visual story.';

  if (q) {
    const searchQuery = decodeURIComponent(q.replace(/\+/g, ' '));
    title = `Search Series: ${searchQuery}`;
    description = `Search results for "${searchQuery}" in our photography series.`;
  }

  return {
    title: `${title} | Tseng Photography`,
    description,
  };
}

export default function SeriesPage() {
  return (
    <CollectionsPageContent
      title='Series'
      description='Ongoing photography projects and thematic collections. From mountain adventures to urban landscapes, each series tells a unique visual story.'
      filterType='series'
      addButtonText='Add New Series'
      countLabel='series'
      itemTypeName='series'
      showGroupsAndUnique={false}
    />
  );
}
