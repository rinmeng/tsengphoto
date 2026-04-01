import { CollectionsPageContent } from '@/components/collections/CollectionsPageContent';
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

  if (group) {
    const groupName = decodeURIComponent(group.replace(/\+/g, ' '));
    title = `${groupName} Collections`;
    description = `Browse the ${groupName} collection of photography. Professional event and portrait photography.`;
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
  };
}

export default function CollectionsPage() {
  return (
    <CollectionsPageContent
      title='Collections'
      description='Explore our portfolio of events, series, and video projects. Each collection tells a unique story through professional photography.'
      addButtonText='Add New Collection'
      countLabel='collections'
      deleteItemName='collection'
      showGroupsAndUnique={true}
    />
  );
}
