import Link from 'next/link';
import Image from 'next/image';
import { Separator } from './ui';

export function Footer() {
  return (
    <footer className='fade-in-from-bottom'>
      <Separator className='border-t-2' />
      <div className='container mx-auto border-x-2 border-dashed'>
        <div className='flex flex-col items-center gap-6 py-8'>
          <div className='text-lg md:text-xl font-semibold'>Contacts</div>
          <Link
            href='https://www.instagram.com/matthewtseng35/'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 hover:opacity-70 transition-opacity'
          >
            <Image
              src='/icons/instagram-svgrepo-com.svg'
              alt='Instagram'
              width={24}
              height={24}
              className='dark:invert'
            />
            <span className='text-base md:text-lg'>matthewtseng35</span>
          </Link>
          <div className='text-sm text-muted-foreground'>
            © {new Date().getFullYear()} Tseng Photography. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
