import { CollectionsPageContent } from '@/components/collections/CollectionsPageContent';

export default function EventsPage() {
  return (
    <CollectionsPageContent
      title='Events'
      description="Capturing life's special moments. From weddings to corporate gatherings, explore our event photography portfolio that preserves memories."
      filterType='event'
      addButtonText='Add New Event'
      countLabel='events'
      deleteItemName='event'
      showGroupsAndUnique={false}
    />
  );
}
