import { CollectionsPageContent } from '@/components/collections/CollectionsPageContent';

export default function SeriesPage() {
  return (
    <CollectionsPageContent
      title='Series'
      description='Ongoing photography projects and thematic collections. From mountain adventures to urban landscapes, each series tells a unique visual story.'
      filterType='series'
      addButtonText='Add New Series'
      countLabel='series'
      deleteItemName='series'
      showGroupsAndUnique={false}
    />
  );
}
