'use client';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  Card,
  CardContent,
} from '@/components/ui';

interface PhotoCarouselProps {
  images: string[];
  autoplayDelay?: number;
  className?: string;
  itemClassName?: string;
  itemsToShow?: 1 | 2 | 3;
  btnVariant?: 'default' | 'outline' | 'ghost';
  btnLocation?: 'default' | 'mb' | 'below-carousel';
  fullWidth?: boolean;
  dotsLocation?: 'absolute' | 'below-carousel';
}

export function PhotoCarousel({
  images,
  autoplayDelay = 3000,
  className,
  itemClassName,
  itemsToShow = 3,
  btnVariant = 'outline',
  btnLocation = 'default',
  fullWidth = false,
  dotsLocation = 'absolute',
}: PhotoCarouselProps) {
  const itemBasisClass =
    itemsToShow === 1
      ? 'basis-full'
      : itemsToShow === 2
        ? 'md:basis-1/2'
        : 'md:basis-1/2 lg:basis-1/3';

  const carouselOpts = {
    align: 'start' as const,
    containScroll: 'trimSnaps' as const,
    loop: true,
  };

  return (
    <section className={cn(!fullWidth && 'container mx-auto', className)}>
      <Carousel
        btnVariant={btnVariant}
        btnLocation={btnLocation}
        showDots={true}
        dotsLocation={dotsLocation}
        className='w-full'
        opts={carouselOpts}
        plugins={[
          Autoplay({
            delay: autoplayDelay,
          }),
        ]}
      >
        <CarouselContent className='-ml-2 md:-ml-4'>
          {images.map((src, index) => (
            <CarouselItem key={index} className={cn('pl-2 md:pl-4', itemBasisClass)}>
              <Card className='p-0'>
                <CardContent
                  className={cn(
                    'flex items-center justify-center p-0 relative',
                    itemClassName
                  )}
                >
                  <Image
                    src={src}
                    alt={`Image ${index + 1}`}
                    fill
                    className='object-cover'
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {btnLocation !== 'below-carousel' && (
          <>
            <CarouselPrevious className='hidden sm:flex' />
            <CarouselNext className='hidden sm:flex' />
          </>
        )}
        {dotsLocation !== 'below-carousel' && <CarouselDots />}
        {(btnLocation === 'below-carousel' || dotsLocation === 'below-carousel') && (
          <div className='flex items-center justify-center gap-4 mt-4'>
            {btnLocation === 'below-carousel' && (
              <CarouselPrevious className='hidden sm:flex' />
            )}
            {dotsLocation === 'below-carousel' && <CarouselDots />}
            {btnLocation === 'below-carousel' && (
              <CarouselNext className='hidden sm:flex' />
            )}
          </div>
        )}
      </Carousel>
    </section>
  );
}
