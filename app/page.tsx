'use client';
import { Hero } from '@/components/Hero';
import { PhotoCarousel } from '@/components/PhotoCarousel';
import { Footer } from '@/components/Footer';
import { Button, Separator } from '@/components/ui';

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
          className='flex justify-center items-center h-30 md:h-60 flex-col gap-4
            border-dashed border-x-2'
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
            <div className='text-xl lg:text-3xl text-center md:text-right'>
              A collection of photos featuring my best work within different photography
              fields.
            </div>
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
          <div className='text-3xl md:text-7xl font-bold'>Photography Services</div>
        </div>
      </section>
      <Separator className='border-t-2' />
      <PhotoCarousel
        className='bg-muted py-8'
        aspectRatio='aspect-video'
        itemsToShow={2}
        dotsLocation='below-carousel'
        btnLocation='below-carousel'
        title='Event Photography'
        description='Capturing key moments and details of a special occasion such as a wedding, corporate event, or party! Candid and posed shots are captured to create a lasting record.'
        images={eventPhotography}
        buttonText='Reserve Now'
        onButtonClick={() => console.log('Navigate to event photography booking')}
      />
      <Separator className='border-t-2' />
      <PhotoCarousel
        className='bg-muted py-8'
        aspectRatio='aspect-1/1'
        itemsToShow={3}
        dotsLocation='below-carousel'
        btnLocation='below-carousel'
        title='Portrait Photography'
        description='Creating stunning images through a photoshoot, whether it is for personal portrait, fasion, or graduation, I capture both artistic and traditional shots to showcase every detail.'
        images={portraitPhotography}
        buttonText='Reserve Now'
        onButtonClick={() => console.log('Navigate to portrait photography booking')}
      />
      <Footer />
    </div>
  );
}
