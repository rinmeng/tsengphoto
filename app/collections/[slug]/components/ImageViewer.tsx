'use client';
import { Button } from '@/components/animate-ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
} from '@/components/animate-ui/components/dialog';
import { PhotoCarousel } from '@/components/PhotoCarousel';
import { Download, X } from 'lucide-react';
import { useState } from 'react';

interface ImageViewerProps {
  images: string[];
  isOpen: boolean;
  showDownloadButton?: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageViewer({
  images,
  isOpen,
  showDownloadButton = false,
  onOpenChange,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDownload = async () => {
    const url = images[currentIndex];
    const response = await fetch(url);
    const blob = await response.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `image-${currentIndex + 1}.jpg`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='w-full sm:max-w-[min(95vw,calc(95vh*16/9))] h-auto p-0 overflow-hidden
          bg-transparent border-0 shadow-none'
      >
        <div className='absolute top-2 right-2 z-10'>
          <div className='flex flex-row gap-4 items-center'>
            {showDownloadButton && (
              <Button variant='ghost' size='icon' onClick={handleDownload}>
                <Download className='size-5' />
              </Button>
            )}
            <DialogClose asChild>
              <Button variant='ghost' size='icon'>
                <X className='size-5' />
              </Button>
            </DialogClose>
          </div>
        </div>

        {images.length > 0 && (
          <PhotoCarousel
            onIndexChange={setCurrentIndex}
            images={images}
            autoplayDelay={0}
            itemsToShow={1}
            navigation='side-center'
            btnVariant='secondary'
            showDots={false}
            fullWidth={true}
            objectFit='contain'
            className='w-full flex-1 min-h-0'
            containerClassName='aspect-video max-h-[90vh]'
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
