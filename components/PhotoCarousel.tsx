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
  containerClassName?: string;
  itemsToShow?: 1 | 2 | 3;
  btnVariant?: 'default' | 'outline' | 'ghost';
  btnLocation?: 'default' | 'mb' | 'below-carousel';
  fullWidth?: boolean;
  dotsLocation?: 'absolute' | 'below-carousel';
  showDots?: boolean;
  objectFit?: 'cover' | 'contain';
}

export function PhotoCarousel({
  images,
  autoplayDelay = 3000,
  className,
  containerClassName,
  itemsToShow = 3,
  btnVariant = 'ghost',
  btnLocation = 'default',
  fullWidth = false,
  dotsLocation = 'absolute',
  showDots = true,
  objectFit = 'cover',
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

  // Only use Autoplay plugin if autoplayDelay is greater than 0
  const plugins = autoplayDelay > 0 ? [Autoplay({ delay: autoplayDelay })] : [];

  return (
    <section className={cn(!fullWidth && 'container mx-auto', className)}>
      <Carousel
        btnVariant={btnVariant}
        btnLocation={btnLocation}
        showDots={showDots}
        dotsLocation={dotsLocation}
        className='w-full'
        opts={carouselOpts}
        plugins={plugins}
      >
        <CarouselContent className={itemsToShow === 1 ? 'ml-0!' : '-ml-2 md:-ml-4'}>
          {images.map((src, index) => (
            <CarouselItem
              key={index}
              className={cn(itemsToShow === 1 ? 'pl-0!' : 'pl-2 md:pl-4', itemBasisClass)}
            >
              {itemsToShow === 1 ? (
                <div
                  className={cn(
                    'flex items-center justify-center relative bg-black w-full',
                    containerClassName
                  )}
                >
                  <Image
                    src={src}
                    alt={`Image ${index + 1}`}
                    fill
                    className={objectFit === 'cover' ? 'object-cover' : 'object-contain'}
                    style={{ objectPosition: 'center' }}
                  />
                </div>
              ) : (
                <Card className='p-0 bg-black'>
                  <CardContent
                    className={cn(
                      'flex items-center justify-center p-0 relative bg-black',
                      containerClassName
                    )}
                  >
                    <Image
                      src={src}
                      alt={`Image ${index + 1}`}
                      fill
                      className={
                        objectFit === 'cover' ? 'object-cover' : 'object-contain'
                      }
                      style={{ objectPosition: 'center' }}
                    />
                  </CardContent>
                </Card>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        {btnLocation !== 'below-carousel' && btnLocation !== 'mb' && (
          <>
            <CarouselPrevious className='hidden sm:flex' />
            <CarouselNext className='hidden sm:flex' />
          </>
        )}
        {dotsLocation !== 'below-carousel' && btnLocation !== 'mb' && showDots && (
          <CarouselDots />
        )}
        {/* Middle-bottom grouped navigation */}
        {btnLocation === 'mb' && (
          <div
            className='absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center
              gap-3'
          >
            <CarouselPrevious className='hidden sm:flex' />
            {dotsLocation !== 'below-carousel' && showDots && (
              <CarouselDots className='static! translate-x-0!' />
            )}
            <CarouselNext className='hidden sm:flex' />
          </div>
        )}
        {/* Below-carousel grouped navigation */}
        {(btnLocation === 'below-carousel' || dotsLocation === 'below-carousel') && (
          <div className='flex items-center justify-center gap-4 mt-4'>
            {btnLocation === 'below-carousel' && (
              <CarouselPrevious className='hidden sm:flex' />
            )}
            {dotsLocation === 'below-carousel' && showDots && <CarouselDots />}
            {btnLocation === 'below-carousel' && (
              <CarouselNext className='hidden sm:flex' />
            )}
          </div>
        )}
      </Carousel>
    </section>
  );
}
