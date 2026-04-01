import { CollectionsPageContent } from '@/components/collections/CollectionsPageContent';

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
