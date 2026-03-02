'use client';
import { Hero } from '@/components/Hero';
import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  Separator,
  Card,
  CardContent,
} from '@/components/ui';
import Autoplay from 'embla-carousel-autoplay';
import { Info, SendHorizonal } from 'lucide-react';
import Image from 'next/image';

const learnMore = [
  '/landing/sections/learn_more_1.jpg',
  '/landing/sections/learn_more_2.jpg',
];

const eventPhotography = [
  '/landing/sections/event_photography/event_photography_1.jpg',
  '/landing/sections/event_photography/event_photography_2.jpg',
  '/landing/sections/event_photography/event_photography_3.jpg',
  '/landing/sections/event_photography/event_photography_4.jpg',
  '/landing/sections/event_photography/event_photography_5.jpg',
  '/landing/sections/event_photography/event_photography_6.jpg',
  '/landing/sections/event_photography/event_photography_7.jpg',
  '/landing/sections/event_photography/event_photography_8.jpg',
  '/landing/sections/event_photography/event_photography_9.jpg',
  '/landing/sections/event_photography/event_photography_10.jpg',
  '/landing/sections/event_photography/event_photography_11.jpg',
  '/landing/sections/event_photography/event_photography_12.jpg',
  '/landing/sections/event_photography/event_photography_13.jpg',
  '/landing/sections/event_photography/event_photography_14.jpg',
  '/landing/sections/event_photography/event_photography_15.jpg',
  '/landing/sections/event_photography/event_photography_16.jpg',
  '/landing/sections/event_photography/event_photography_17.jpg',
  '/landing/sections/event_photography/event_photography_18.jpg',
  '/landing/sections/event_photography/event_photography_19.jpg',
];

const portraitPhotography = [
  '/landing/sections/portrait_photography/portrait_photography_1.jpg',
  '/landing/sections/portrait_photography/portrait_photography_2.jpg',
  '/landing/sections/portrait_photography/portrait_photography_3.jpg',
  '/landing/sections/portrait_photography/portrait_photography_4.jpg',
  '/landing/sections/portrait_photography/portrait_photography_5.jpg',
  '/landing/sections/portrait_photography/portrait_photography_6.jpg',
  '/landing/sections/portrait_photography/portrait_photography_7.jpg',
  '/landing/sections/portrait_photography/portrait_photography_8.jpg',
  '/landing/sections/portrait_photography/portrait_photography_9.jpg',
  '/landing/sections/portrait_photography/portrait_photography_10.jpg',
];

export default function Home() {
  return (
    <div className='mx-auto px-4fade-in-from-bottom overflow-x-hidden'>
      <Hero />
      <section className='container mx-auto'>
        <div
          className='flex justify-center items-center h-60 flex-col gap-4 border-dashed
            border-x-2'
        >
          <div className='text-3xl md:text-7xl font-bold'>Event Photographer</div>
          <div className='text-xl md:text-2xl'>Kelowna & Vancouver</div>
        </div>
      </section>
      <Separator className='border-t-2' />
      <section className='container mx-auto'>
        <div
          className='h-140 bg-muted flex flex-col md:flex-row items-center border-dashed
            border-x-2 justify-center gap-4 p-4'
        >
          <div className='relative w-full md:w-1/2 aspect-4/3'>
            <Image
              src={learnMore[0]}
              fill
              alt='event picture with many people having fun'
              className='object-contain'
            />
          </div>
          <div className='w-full md:w-1/2 flex flex-col gap-4 px-4'>
            <div className='text-xl lg:text-3xl text-center md:text-left'>
              Check out photos taken at various events, capturing the best moments within.
            </div>
            <Button variant='default' size='lg' className='self-center md:self-start'>
              <Info /> Learn More
            </Button>
          </div>
        </div>
      </section>
      <Separator className='border-t-2' />
      <section className='container mx-auto'>
        <div
          className='h-140 bg-muted flex flex-col md:flex-row-reverse border-dashed
            border-x-2 items-center justify-center gap-4 p-4'
        >
          <div className='relative w-full md:w-1/2 aspect-4/3'>
            <Image
              src={learnMore[1]}
              fill
              alt='event picture with many people having fun'
              className='object-contain'
            />
          </div>
          <div className='w-full md:w-1/2 flex flex-col gap-4 px-4'>
            <div className='text-xl lg:text-3xl text-center md:text-right'>
              A collection of photos featuring my best work within different photography
              fields.
            </div>
            <Button variant='default' size='lg' className='self-center md:self-end'>
              <Info /> Learn More
            </Button>
          </div>
        </div>
      </section>
      <Separator className='border-t-2' />
      <section className='container mx-auto'>
        <div
          className='flex justify-center items-center h-60 flex-col gap-4 border-dashed
            border-x-2'
        >
          <div className='text-3xl md:text-7xl font-bold'>Photography Services</div>
        </div>
      </section>
      <Separator className='border-t-2' />
      <section className='container mx-auto'>
        <div
          className='flex justify-center items-center flex-col gap-8 border-dashed
            border-x-2 py-8'
        >
          <div className='text-xl md:text-4xl'>Event Photography</div>
          <Carousel
            showDots={true}
            className='w-full'
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
          >
            <CarouselContent>
              {eventPhotography.map((src, index) => (
                <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/3'>
                  <div>
                    <Card className='p-0'>
                      <CardContent
                        className='flex items-center justify-center p-0 relative
                          aspect-9/14'
                      >
                        <Image
                          src={src}
                          alt={`Event photography ${index + 1}`}
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
          <div className='flex justify-center flex-col gap-4 max-w-5/6'>
            <div className='text-center'>
              Capturing key moments and details of a special occasion such as a wedding,
              corporate event, or party! Candid and posed shots are captured to create a
              lasting record.
            </div>
            <Button variant='default' size='xl' className='self-center'>
              Reserve Now
              <SendHorizonal />
            </Button>
          </div>
        </div>
      </section>
      <Separator className='border-t-2' />
      <section className='container mx-auto'>
        <div
          className='flex justify-center items-center flex-col gap-8 border-dashed
            border-x-2 py-8'
        >
          <div className='text-xl md:text-4xl'>Portrait Photography</div>
          <Carousel
            showDots={true}
            className='w-full'
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
          >
            <CarouselContent>
              {portraitPhotography.map((src, index) => (
                <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/3'>
                  <div>
                    <Card className='p-0'>
                      <CardContent
                        className='flex items-center justify-center p-0 relative
                          aspect-9/14'
                      >
                        <Image
                          src={src}
                          alt={`Portrait photography ${index + 1}`}
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
          <div className='flex justify-center flex-col gap-4 max-w-5/6'>
            <div className='text-center'>
              Creating stunning images through a photoshoot, whether it is for personal
              portrait, fasion, or graduation, I capture both artistic and traditional
              shots to showcase every detail.
            </div>
            <Button variant='default' size='xl' className='self-center'>
              Reserve Now
              <SendHorizonal />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
