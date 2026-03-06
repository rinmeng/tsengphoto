'use client';
import { Text } from '@/components/Text';
import Image from 'next/image';
import { Separator } from '@/components/ui';

export default function AboutPage() {
  return (
    <section className='pt-18 relative'>
      <div className='container mx-auto fade-in-from-top p-4 border-x-2 border-dashed'>
        <Text variant='hd-xxl'>About me</Text>
      </div>
      <Separator className='border-t-2' />
      <div className='container mx-auto border-x-2 border-dashed p-4'>
        <div className='max-w-4xl mx-auto space-y-8'>
          {/* Header */}
          {/* Image */}
          <div
            className='relative w-full aspect-video rounded overflow-hidden
              fade-in-from-left'
          >
            <Image
              src='/about/about.jpg'
              alt='Young man with glasses sitting on the edge of a blue sports car with gullwing doors open, another person standing beside him holding a camera.'
              fill
              className='object-cover'
              priority
            />
          </div>

          {/* Bio Text */}
          <div className='space-y-4 fade-in-from-bottom'>
            <Text variant='bd-lg'>
              Hello! I&apos;m Matthew Tseng and I have been an event photographer for
              clubs on the UBCO campus for 2 years. My vision of a perfect shot is one
              that prioritizes the main subject while keeping colours more natural-like.
              My goal is to bring satisfaction to people through the images I take of
              them!
            </Text>
            <Text variant='bd-lg'>I look forward to working with you!</Text>
          </div>
        </div>
      </div>
    </section>
  );
}
