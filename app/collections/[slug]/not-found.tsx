import { EmptyState } from '@/components/EmptyState';
import { ArrowLeft, ImageOff } from 'lucide-react';

export default function CollectionNotFound() {
  return (
    <div className='container mx-auto nb-padding fade-in-from-top px-4 pb-4 h-screen'>
      <EmptyState
        className='h-full'
        bordered={true}
        icon={ImageOff}
        title='Collection Not Found'
        description="The collection you're looking for doesn't exist or has been removed."
        buttonText='Back to Collections'
        buttonHref='/collections'
        buttonIcon={ArrowLeft}
      />
    </div>
  );
}
