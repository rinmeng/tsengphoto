'use client';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Text } from '@/components/Text';
import { Separator } from '@/components/ui';
import { getDelayClass } from '@/utils/animations';

export default function AboutPage() {
  return (
    <section className='pt-18 relative'>
      <div className={'container mx-auto p-4 border-x-2 border-dashed'}>
        <Text variant='hd-xxl' className={`fade-in-from-top ${getDelayClass(0)}`}>
          About me
        </Text>
      </div>
      <Separator className='border-t-2' />
      <div className={'container mx-auto border-x-2 border-dashed p-4'}>
        <div className='max-w-4xl mx-auto space-y-8'>
          <div
            className={`relative w-full aspect-video rounded overflow-hidden
              fade-in-from-top ${getDelayClass(1)}`}
          >
            <OptimizedImage
              src='/about/about.jpg'
              alt='Young man with glasses sitting on the edge of a blue sports car with gullwing doors open, another person standing beside him holding a camera.'
              fill
              className='object-cover'
            />
          </div>

          {/* Bio Text */}
          <div className={`space-y-4 fade-in-from-top ${getDelayClass(2)}`}>
            <Text variant='bd-lg'>
              Hello! My name is Matthew Tseng and I&apos;m an event photographer with 4+
              years of experience capturing both photos and videos. My photography journey
              began in 2016 when I was a highschool student. Starting with portraits and
              landscape, before transitioning to event photography when I got involved in
              university clubs and activities. My vision of a perfect shot is one that
              prioritizes the main subject while keeping colours more natural-like. My
              goal is to bring satisfaction to people through the images I take of them! I
              look forward to working with you
            </Text>
            <Text variant='bd-lg' className={`fade-in-from-top ${getDelayClass(3)}`}>
              I look forward to working with you!
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
}
