'use client';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { SendHorizonal } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Button,
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
  title: string;
  description?: string;
  images: string[];
  buttonText?: string;
  onButtonClick?: () => void;
  autoplayDelay?: number;
  className?: string;
  aspectRatio?: string;
  itemsToShow?: 1 | 2 | 3;
  btnVariant?: 'default' | 'outline' | 'ghost';
  btnLocation?: 'default' | 'mb' | 'below-carousel';
  showTitle?: boolean;
  fullWidth?: boolean;
  dotsLocation?: 'absolute' | 'below-carousel';
}

export function PhotoCarousel({
  title,
  description,
  images,
  buttonText,
  onButtonClick,
  autoplayDelay = 3000,
  className,
  aspectRatio = 'aspect-video4',
  itemsToShow = 3,
  btnVariant = 'outline',
  btnLocation = 'default',
  showTitle = true,
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
      <div
        className='flex justify-center items-center flex-col gap-8 border-dashed
          border-x-2'
      >
        {showTitle && <div className='text-2xl md:text-4xl'>{title}</div>}
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
                <div>
                  <Card className='p-0'>
                    <CardContent
                      className={`flex items-center justify-center p-0 relative
                      ${aspectRatio}`}
                    >
                      <Image
                        src={src}
                        alt={`${title} ${index + 1}`}
                        fill
                        className='object-cover object-top'
                      />
                    </CardContent>
                  </Card>
                </div>
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
        {(description || buttonText) && (
          <div className='flex justify-center flex-col gap-4 max-w-5/6'>
            {description && <div className='text-center'>{description}</div>}
            {buttonText && onButtonClick && (
              <Button
                variant='default'
                size='xl'
                className='self-center'
                onClick={onButtonClick}
              >
                {buttonText}
                <SendHorizonal />
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
