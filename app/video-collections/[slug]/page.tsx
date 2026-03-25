'use client';

import { notFound, useParams } from 'next/navigation';
import { Text } from '@/components/Text';
import { Calendar, MapPin, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/animate-ui/components/button';
import { VideoCard } from '@/components/video-collections/VideoCard';
import { VideoViewer } from '@/components/video-collections/VideoViewer';
import { VideoUploadDialog } from '@/components/video-collections/VideoUploadDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { videoCollectionsQueryKeys } from '@/lib/queries/video-collections';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import VideoCollectionDetailLoading from './loading';
import { useState } from 'react';
import type { Video } from '@/lib/types';
import { EmptyState } from '@/components/EmptyState';
import { Video as VideoIcon } from 'lucide-react';
import { getDelayClass } from '@/utils/animations';

export default function VideoCollectionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

  const {
    data: videoCollection,
    isLoading: isLoadingCollection,
    isError,
  } = useQuery({
    queryKey: [...videoCollectionsQueryKeys.bySlug(slug), { includeUnpublished: !!user }],
    queryFn: async () => {
      const response = await fetch(`/api/v1/video-collections/${slug}`);
      if (!response.ok) {
        throw new Error('Video collection not found');
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !authLoading,
  });

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsViewerOpen(true);
  };

  const handleDeleteClick = (videoId: string) => {
    setVideoToDelete(videoId);
  };

  const deleteVideoMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const response = await fetch(`/api/v1/video/${videoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Something went wrong.');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: videoCollectionsQueryKeys.bySlug(slug),
      });
      toast.success('Video removed from collection');
      setVideoToDelete(null);
    },
    onError: (error: Error) => {
      toast.error('Failed to delete video', { description: error.message });
    },
  });

  const confirmDelete = () => {
    if (videoToDelete) {
      deleteVideoMutation.mutate(videoToDelete);
    }
  };

  if (authLoading || isLoadingCollection) {
    return <VideoCollectionDetailLoading />;
  }

  if (isError || !videoCollection) {
    return notFound();
  }

  const formattedDate = videoCollection.date
    ? new Date(videoCollection.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const sortedVideos = (videoCollection.videos || []).sort(
    (a: Video, b: Video) => (a.order || 0) - (b.order || 0)
  );

  return (
    <>
      <section
        className='container border-x-2 border-dashed mx-auto pb-4 px-4 nb-padding flex
          flex-col min-h-screen'
      >
        {/* Back Button */}
        <div className={`sticky top-20 mb-6 z-50 fade-in-from-top ${getDelayClass(0)}`}>
          <div className='flex items-center gap-4'>
            <Link href='/video-collections'>
              <Button variant='default'>
                <ArrowLeft />
                Back to Video Collections
              </Button>
            </Link>
            {user && (
              <Button variant='secondary' onClick={() => setUploadDialogOpen(true)}>
                <Plus />
                Add Video
              </Button>
            )}
          </div>
        </div>

        {/* Header */}
        <div className='mb-12 space-y-6'>
          <div className='space-y-4'>
            <Text variant='hd-xxl' className={`fade-in-from-top ${getDelayClass(1)}`}>
              {videoCollection.title}
            </Text>
            {videoCollection.description && (
              <Text
                variant='bd-lg'
                className={`text-muted-foreground max-w-3xl fade-in-from-top
                ${getDelayClass(2)}`}
              >
                {videoCollection.description}
              </Text>
            )}
          </div>

          {/* Metadata */}
          <div
            className={`flex flex-wrap gap-6 text-muted-foreground fade-in-from-top
              ${getDelayClass(3)}`}
          >
            {formattedDate && (
              <div className='flex items-center gap-2'>
                <Calendar className='size-5' />
                <Text variant='bd-md'>{formattedDate}</Text>
              </div>
            )}
            {videoCollection.location && (
              <div className='flex items-center gap-2'>
                <MapPin className='size-5' />
                <Text variant='bd-md'>{videoCollection.location}</Text>
              </div>
            )}
          </div>
        </div>

        {/* Videos Grid */}
        {sortedVideos.length === 0 ? (
          <EmptyState
            icon={VideoIcon}
            title='No videos yet'
            description={
              user
                ? 'Get started by adding your first video to this collection.'
                : 'Check back later for video content.'
            }
            className='border-dashed border-2'
          />
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {sortedVideos.map((video: Video, index: number) => (
              <div
                key={video.id}
                className={`fade-in-from-top ${getDelayClass(index + 4)}`}
              >
                <VideoCard
                  video={video}
                  isAuthenticated={!!user}
                  onDelete={handleDeleteClick}
                  onClick={handleVideoClick}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Video Upload Dialog */}
      {user && (
        <VideoUploadDialog
          videoCollectionId={videoCollection.id}
          videoCollectionSlug={slug}
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
        />
      )}

      {/* Video Viewer */}
      <VideoViewer
        video={selectedVideo}
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!videoToDelete} onOpenChange={() => setVideoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the video from
              this collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
