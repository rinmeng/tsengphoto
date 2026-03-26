import Link from 'next/link';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Separator } from './ui';
import { getDelayClass } from '@/utils/animations';

export function Footer() {
  return (
    <footer>
      <Separator className='border-t-2' />
      <div className='container mx-auto border-x-2 border-dashed'>
        <div className='flex flex-col items-center gap-6 py-8'>
          <div
            className={`text-lg md:text-xl font-semibold fade-in-from-bottom
              ${getDelayClass(1)}`}
          >
            Contacts
          </div>
          <Link
            href='https://www.instagram.com/matthewtseng35/'
            target='_blank'
            rel='noopener noreferrer'
            className={`flex items-center gap-2 hover:opacity-70 transition-opacity
              fade-in-from-bottom ${getDelayClass(2)}`}
          >
            <OptimizedImage
              src='/icons/instagram-svgrepo-com.svg'
              alt='Instagram'
              width={24}
              height={24}
              className='dark:invert'
            />
            <span className='text-base md:text-lg'>matthewtseng35</span>
          </Link>
          <div
            className={`flex items-center gap-2 text-sm text-muted-foreground
              fade-in-from-bottom ${getDelayClass(3)}`}
          >
            <p>Made with ❤️ by</p>
            <Link
              href='https://rinm.dev'
              target='_blank'
              rel='noreferrer'
              className='hover:opacity-70 transition-opacity'
            >
              <OptimizedImage
                src='/rmlogo.png'
                alt='rmlogo'
                width={64}
                height={32}
                className='h-auto w-16 dark:invert'
              />
            </Link>
          </div>
          <div
            className={`text-sm text-muted-foreground fade-in-from-bottom
              ${getDelayClass(4)}`}
          >
            © {new Date().getFullYear()} Tseng Photography. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
