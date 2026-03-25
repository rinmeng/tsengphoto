import { VideoCollectionWithVideos } from '@/lib/types';
import { VideoCollectionCard } from './VideoCollectionCard';
import { getDelayClass } from '@/utils/animations';
import { EmptyState } from '../EmptyState';
import { ArrowLeft, Video } from 'lucide-react';

interface VideoCollectionGridProps {
  videoCollections: VideoCollectionWithVideos[];
  isAuthenticated?: boolean;
  onEdit?: (videoCollection: VideoCollectionWithVideos) => void;
  onDelete?: (videoCollectionId: string) => void;
  onPublish?: (videoCollectionId: string) => void;
}

export function VideoCollectionGrid({
  videoCollections,
  isAuthenticated = false,
  onEdit,
  onDelete,
  onPublish,
}: VideoCollectionGridProps) {
  if (videoCollections.length === 0) {
    return (
      <div className='container mx-auto fade-in-from-top h-[50vh]'>
        <EmptyState
          className='h-full'
          bordered={true}
          icon={Video}
          title={`There's nothing here`}
          description='Come back later when we have some video collections to show!'
          buttonIcon={ArrowLeft}
        />
      </div>
    );
  }

  return (
    <div className='container grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
      {videoCollections.map((videoCollection, index) => (
        <VideoCollectionCard
          className={`h-full fade-in-from-bottom ${getDelayClass(index)}`}
          key={videoCollection.id}
          videoCollection={videoCollection}
          isAuthenticated={isAuthenticated}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublish={onPublish}
        />
      ))}
    </div>
  );
}
