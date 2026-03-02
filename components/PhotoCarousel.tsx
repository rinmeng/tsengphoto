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
}: PhotoCarouselProps) {
  return (
    <section className={cn('container mx-auto', className)}>
      <div
        className='flex justify-center items-center flex-col gap-8 border-dashed
          border-x-2 py-8'
      >
        <div className='text-2xl md:text-4xl'>{title}</div>
        <Carousel
          showDots={true}
          className='w-full'
          plugins={[
            Autoplay({
              delay: autoplayDelay,
            }),
          ]}
        >
          <CarouselContent>
            {images.map((src, index) => (
              <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/3'>
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
