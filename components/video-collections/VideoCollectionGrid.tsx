import { useMemo } from 'react';
import { VideoCollectionWithVideos } from '@/lib/types';
import { VideoCollectionCard } from './VideoCollectionCard';
import { getDelayClass } from '@/utils/animations';
import { EmptyState } from '../EmptyState';
import { ArrowLeft, Video } from 'lucide-react';

interface VideoCollectionGridProps {
  videoCollections: VideoCollectionWithVideos[];
  onEdit?: (videoCollection: VideoCollectionWithVideos) => void;
  onDelete?: (videoCollectionId: string) => void;
  onPublish?: (videoCollectionId: string) => void;
}

export function VideoCollectionGrid({
  videoCollections,
  onEdit,
  onDelete,
  onPublish,
}: VideoCollectionGridProps) {
  // Sort video collections by date (recent to old), fall back to created_at if no date
  const sortedVideoCollections = useMemo(() => {
    return [...videoCollections].sort((a, b) => {
      // Both have dates - sort by date
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      // Only a has date - a comes first
      if (a.date && !b.date) return -1;
      // Only b has date - b comes first
      if (!a.date && b.date) return 1;
      // Neither has date - sort by created_at
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [videoCollections]);

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
      {sortedVideoCollections.map((videoCollection, index) => (
        <VideoCollectionCard
          className={`h-full fade-in-from-bottom ${getDelayClass(index)}`}
          key={videoCollection.id}
          videoCollection={videoCollection}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublish={onPublish}
        />
      ))}
    </div>
  );
}
