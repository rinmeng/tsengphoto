import { CollectionsPageContent } from '@/components/collections/CollectionsPageContent';
import type { Metadata } from 'next';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q as string | undefined;

  let title = 'Events';
  let description =
    "Capturing life's special moments. From weddings to corporate gatherings, explore our event photography portfolio that preserves memories.";

  if (q) {
    const searchQuery = decodeURIComponent(q.replace(/\+/g, ' '));
    title = `Search Events: ${searchQuery}`;
    description = `Search results for "${searchQuery}" in our event photography collections.`;
  }

  return {
    title: `${title} | Tseng Photography`,
    description,
  };
}

export default function EventsPage() {
  return (
    <CollectionsPageContent
      title='Events'
      description="Capturing life's special moments. From weddings to corporate gatherings, explore our event photography portfolio that preserves memories."
      filterType='event'
      addButtonText='Add New Event'
      countLabel='events'
      itemTypeName='event'
      showGroupsAndUnique={false}
    />
  );
}
