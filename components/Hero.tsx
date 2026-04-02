'use client';
import { cn } from '@/lib';
import { PhotoCarousel } from './PhotoCarousel';

const images = [
  '/landing/carousel/carousel_1.jpg',
  '/landing/carousel/carousel_2.jpg',
  '/landing/carousel/carousel_3.jpg',
  '/landing/carousel/carousel_4.jpg',
  '/landing/carousel/carousel_5.jpg',
];

export function Hero({ className }: { className?: string }) {
  return (
    <PhotoCarousel
      images={images}
      autoplayDelay={3000}
      className={cn('w-screen', className)}
      containerClassName='h-screen'
      itemsToShow={1}
      btnVariant='ghost'
      btnLocation='mb'
      fullWidth={true}
      showLoading={false}
    />
  );
}
