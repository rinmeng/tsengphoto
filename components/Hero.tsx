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
  '/landing/carousel/1.webp',
  '/landing/carousel/2.webp',
  '/landing/carousel/3.webp',
  '/landing/carousel/4.webp',
  '/landing/carousel/5.webp',
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
            delay: 2000,
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
