'use client';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/carousel';

const images = [
  '/landing/carousel/carousel_1.jpg',
  '/landing/carousel/carousel_2.jpg',
  '/landing/carousel/carousel_3.jpg',
  '/landing/carousel/carousel_4.jpg',
  '/landing/carousel/carousel_5.jpg',
];

export function Hero() {
  return (
    <section className='relative w-screen flex items-center justify-center'>
      <Carousel
        btnVariant='ghost'
        btnLocation='mb'
        showDots={true}
        className='w-full'
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div>
                <Card className='p-0'>
                  <CardContent
                    className='flex items-center justify-center p-0 relative h-screen'
                  >
                    <Image
                      src={src}
                      alt={`Carousel image ${index + 1}`}
                      fill
                      className='object-cover object-center'
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </section>
  );
}
