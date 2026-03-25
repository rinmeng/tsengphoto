import { EmptyState } from '@/components/EmptyState';
import { ArrowLeft, Video } from 'lucide-react';

export default function VideoCollectionNotFound() {
  return (
    <div className='container mx-auto nb-padding fade-in-from-top px-4 pb-4 h-screen'>
      <EmptyState
        className='h-full'
        bordered={true}
        icon={Video}
        title='Video Collection Not Found'
        description="The video collection you're looking for doesn't exist or has been removed."
        buttonText='Back to Video Collections'
        buttonHref='/video-collections'
        buttonIcon={ArrowLeft}
      />
    </div>
  );
}
