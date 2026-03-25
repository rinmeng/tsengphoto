'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Video as VideoType } from '@/lib/types';
import { generateYouTubeEmbedUrl } from '@/services/videos.service';

interface VideoViewerProps {
  video: VideoType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoViewer({ video, open, onOpenChange }: VideoViewerProps) {
  if (!video) return null;

  const embedUrl = generateYouTubeEmbedUrl(video.youtube_video_id, true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='w-full sm:w-[95%] h-auto p-0 sm:max-w-none overflow-hidden
          bg-transparent border-0 shadow-none'
      >
        <div className='relative aspect-video w-full'>
          <iframe
            src={embedUrl}
            allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen'
            allowFullScreen
            className='absolute inset-0 w-full h-full'
            title={video.title || 'YouTube video'}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
