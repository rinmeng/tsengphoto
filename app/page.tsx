import { Hero } from '@/components/Hero';
import { Button, Carousel, Separator } from '@/components/ui';
import Image from 'next/image';

const learnMore = [
  '/landing/sections/learn_more_1.jpg',
  '/landing/sections/learn_more_2.jpg',
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
          <div className='relative w-full md:w-1/2 aspect-[4/3]'>
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
          <div className='relative w-full md:w-1/2 aspect-[4/3]'>
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
          className='flex justify-center items-center h-60 flex-col gap-4 border-dashed
            border-x-2'
        >
          <div className='text-3xl md:text-7xl font-bold'>Photography Services</div>
        </div>
      </section>
      <Separator className='border-t-2' />
      <section className='container mx-auto'>
        <div
          className='flex justify-center items-center h-60 flex-col gap-4 border-dashed
            border-x-2'
        >
          <div className='text-xl md:text-4xl'>Event Photography</div>
          <Carousel></Carousel>
        </div>
      </section>
    </div>
  );
}
