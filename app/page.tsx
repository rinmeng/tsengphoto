import { Hero } from '@/components/Hero';
import { Button } from '@/components/ui';
import Image from 'next/image';

const learnMore = [
  '/landing/sections/learn-more-1.webp',
  '/landing/sections/learn-more-2.webp',
];

export default function Home() {
  return (
    <div className='mx-auto px-4fade-in-from-bottom overflow-x-hidden'>
      <Hero />

      <div className='container mx-auto'>
        <section className='flex justify-center items-center h-60 flex-col gap-4'>
          <div className='text-3xl md:text-7xl font-bold'>Event Photographer</div>
          <div className='text-xl md:text-2xl'>Kelowna & Vancouver</div>
        </section>

        <section
          className='h-screen bg-muted flex flex-col md:flex-row items-center
            justify-center gap-4 p-4'
        >
          <div className='relative w-full h-1/4 md:w-1/2 md:h-1/2'>
            <Image
              src={learnMore[0]}
              fill
              alt='event picture with many people having fun'
              className='object-contain'
            />
          </div>
          <div className='w-full md:w-1/2 flex flex-col gap-4 px-4'>
            <div className='text-xl md:text-3xl'>
              Check out photos taken at various events, capturing the best moments within.
            </div>
            <Button variant='outline' size='lg' className='self-start'>
              Learn More
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
