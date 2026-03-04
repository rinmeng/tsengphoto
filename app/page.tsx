'use client';
import { Hero } from '@/components/Hero';
import { PhotoCarousel } from '@/components/PhotoCarousel';
import { Footer } from '@/components/Footer';
import { Text } from '@/components/Text';
import { Button, Separator } from '@/components/ui';
import { SendHorizonal } from 'lucide-react';

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
    <div className='mx-auto overflow-x-hidden'>
      <Hero />
      <section className='container mx-auto'>
        <div
          className='flex justify-center items-center h-30 md:h-60 flex-col gap-4
            border-dashed border-x-2'
        >
          <div className='text-center space-y-2'>
            <Text variant='hd-xl'>Event Photographer</Text>
            <Text variant='bd-lg' className='text-muted-foreground'>
              Kelowna & Vancouver
            </Text>
          </div>
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
            <Text variant='bd-lg' className='text-center md:text-left'>
              Check out photos taken at various events, capturing the best moments within.
            </Text>
            <Button variant='default' size='lg' className='self-center md:self-start'>
              Learn More
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
            <Text variant='bd-lg' className='text-center md:text-right'>
              A collection of photos featuring my best work within different photography
              fields.
            </Text>
            <Button variant='default' size='lg' className='self-center md:self-end'>
              Learn More
            </Button>
          </div>
        </div>
      </section>
      <Separator className='border-t-2' />
      <section className='container mx-auto'>
        <div
          className='flex justify-center items-center h-30 md:h-60 flex-col gap-4
            border-dashed border-x-2'
        >
          <Text variant='hd-xl'>Photography Services</Text>
        </div>
      </section>
      <Separator className='border-t-2' />
      <section className='bg-muted py-8'>
        <div
          className='container mx-auto flex justify-center items-center flex-col gap-8
            px-8'
        >
          <Text variant='hd-lg'>Event Photography</Text>
          <Text variant='bd-md' className='text-center max-w-3xl'>
            Capturing key moments and details of a special occasion such as a wedding,
            corporate event, or party! Candid and posed shots are captured to create a
            lasting record.
          </Text>
        </div>
        <PhotoCarousel
          className='mt-8'
          itemClassName='aspect-video'
          itemsToShow={2}
          dotsLocation='below-carousel'
          btnLocation='below-carousel'
          images={eventPhotography}
        />
        <div className='container mx-auto flex justify-center mt-8'>
          <Button
            variant='default'
            size='xl'
            onClick={() => console.log('Navigate to event photography booking')}
          >
            Reserve Now
            <SendHorizonal />
          </Button>
        </div>
      </section>
      <Separator className='border-t-2' />
      <section className='bg-muted py-8'>
        <div
          className='container mx-auto flex justify-center items-center flex-col gap-8
            px-8'
        >
          <Text variant='hd-lg'>Portrait Photography</Text>
          <Text variant='bd-md' className='text-center max-w-3xl'>
            Creating stunning images through a photoshoot, whether it is for personal
            portrait, fashion, or graduation, I capture both artistic and traditional
            shots to showcase every detail.
          </Text>
        </div>
        <PhotoCarousel
          className='mt-8'
          itemClassName='aspect-square'
          itemsToShow={3}
          dotsLocation='below-carousel'
          btnLocation='below-carousel'
          images={portraitPhotography}
        />
        <div className='container mx-auto flex justify-center mt-8'>
          <Button
            variant='default'
            size='xl'
            onClick={() => console.log('Navigate to portrait photography booking')}
          >
            Reserve Now
            <SendHorizonal />
          </Button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
