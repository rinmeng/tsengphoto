'use client';
import { Button } from '@/components/animate-ui/components/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui';
import { PhotoCarousel } from '@/components/PhotoCarousel';
import { X } from 'lucide-react';

interface ImageViewerProps {
  images: string[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageViewer({ images, isOpen, onOpenChange }: ImageViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='w-full sm:w-[95%] h-auto p-0 sm:max-w-none overflow-hidden
          bg-transparent border-0 shadow-none'
      >
        <DialogClose asChild className='absolute top-2 right-2 z-10'>
          <Button variant='ghost' size='icon'>
            <X className='size-5' />
          </Button>
        </DialogClose>
        {images.length > 0 && (
          <PhotoCarousel
            images={images}
            autoplayDelay={0}
            itemsToShow={1}
            btnLocation='mb'
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
