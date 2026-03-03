'use client';
import { PhotoCarousel } from './PhotoCarousel';

const images = [
  '/landing/carousel/carousel_1.jpg',
  '/landing/carousel/carousel_2.jpg',
  '/landing/carousel/carousel_3.jpg',
  '/landing/carousel/carousel_4.jpg',
  '/landing/carousel/carousel_5.jpg',
];

export function Hero() {
  return (
    <PhotoCarousel
      title='Hero Carousel'
      images={images}
      autoplayDelay={3000}
      className='w-screen'
      aspectRatio='h-screen'
      itemsToShow={1}
      btnVariant='ghost'
      btnLocation='mb'
      showTitle={false}
      fullWidth={true}
    />
  );
}
