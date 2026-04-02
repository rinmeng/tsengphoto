'use client';
import { OptimizedImage } from '@/components/OptimizedImage';
import {
  Card,
  CardContent,
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';

interface PhotoCarouselProps {
  images: string[];
  autoplayDelay?: number;
  className?: string;
  containerClassName?: string;
  itemsToShow?: 1 | 2 | 3;
  btnVariant?: 'default' | 'outline' | 'ghost' | 'secondary';
  navigation?: 'overlay' | 'bottom-center' | 'side-center' | 'below' | 'none';
  showButtons?: boolean;
  fullWidth?: boolean;
  showDots?: boolean;
  objectFit?: 'cover' | 'contain';
  objectPosition?: string;
  showLoading?: boolean;
  onIndexChange?: (index: number) => void;
}

export function PhotoCarousel({
  images,
  autoplayDelay = 3000,
  className,
  containerClassName,
  itemsToShow = 3,
  btnVariant = 'ghost',
  navigation = 'overlay',
  showButtons = true,
  fullWidth = false,
  showDots = true,
  objectFit = 'cover',
  objectPosition = 'center',
  showLoading = true,
  onIndexChange,
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

  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api || !onIndexChange) return;
    api.on('select', () => onIndexChange(api.selectedScrollSnap()));
  }, [api, onIndexChange]);

  return (
    <section
      className={cn(
        !fullWidth && 'container mx-auto',
        itemsToShow === 1 && 'bg-transparent',
        className
      )}
    >
      <Carousel
        setApi={setApi}
        btnVariant={btnVariant}
        showDots={showDots}
        className={cn('w-full', navigation === 'below' && 'pb-16')}
        opts={carouselOpts}
        plugins={plugins}
      >
        <CarouselContent
          className={itemsToShow === 1 ? 'ml-0! bg-transparent' : '-ml-2 md:-ml-4'}
        >
          {images.map((src, index) => (
            <CarouselItem
              key={index}
              className={cn(
                itemsToShow === 1 ? 'pl-0! bg-transparent border-0' : 'pl-2 md:pl-4',
                itemBasisClass
              )}
            >
              {itemsToShow === 1 ? (
                <div
                  className={cn(
                    'flex items-center justify-center relative bg-transparent w-full',
                    containerClassName
                  )}
                >
                  <OptimizedImage
                    src={src}
                    alt={`Image ${index + 1}`}
                    fill
                    className={objectFit === 'cover' ? 'object-cover' : 'object-contain'}
                    style={{ objectPosition }}
                    showLoading={showLoading}
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
                    <OptimizedImage
                      src={src}
                      alt={`Image ${index + 1}`}
                      fill
                      className={
                        objectFit === 'cover' ? 'object-cover' : 'object-contain'
                      }
                      style={{ objectPosition }}
                    />
                  </CardContent>
                </Card>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation: Overlay (default) */}
        {navigation === 'overlay' && (
          <>
            {showButtons && (
              <>
                <CarouselPrevious className='hidden sm:flex' />
                <CarouselNext className='hidden sm:flex' />
              </>
            )}
            {showDots && <CarouselDots />}
          </>
        )}
        {/* Navigation: Bottom Center */}
        {navigation === 'bottom-center' && (
          <div
            className='absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center
              mb-2 gap-3'
          >
            {showButtons && <CarouselPrevious className='hidden sm:flex' />}
            {showDots && <CarouselDots className='static translate-x-0' />}
            {showButtons && <CarouselNext className='hidden sm:flex' />}
          </div>
        )}
        {/* Navigation: Side Center */}
        {navigation === 'side-center' && (
          <>
            {showButtons && (
              <>
                <CarouselPrevious className='hidden sm:flex left-4' />
                <CarouselNext className='hidden sm:flex right-4' />
              </>
            )}
            {showDots && (
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-10'>
                <CarouselDots className='static translate-x-0' />
              </div>
            )}
          </>
        )}
        {/* Navigation: Below */}
        {navigation === 'below' && (
          <div className='flex items-center justify-center gap-4 mt-2'>
            {showButtons && (
              <CarouselPrevious className='static translate-x-0 translate-y-0' />
            )}
            {showDots && <CarouselDots className='static translate-x-0' />}
            {showButtons && (
              <CarouselNext className='static translate-x-0 translate-y-0' />
            )}
          </div>
        )}
        {/* Navigation: None - render nothing */}
      </Carousel>
    </section>
  );
}
