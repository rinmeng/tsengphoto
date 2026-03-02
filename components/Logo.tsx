import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Infinity } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  onClick?: () => void;
}

export function Logo({ className, iconSize = 20, showText = true, onClick }: LogoProps) {
  return (
    <div className='flex items-center justify-center'>
      <Button variant='link' className='p-0 m-0'>
        <Link
          href='/'
          className={cn('flex items-center gap-2', className)}
          onClick={onClick}
        >
          <Image
            src='/favicon.ico'
            alt='Logo'
            width={iconSize}
            height={iconSize}
            className={cn('h-5 w-5')}
            style={{ width: iconSize, height: iconSize }}
          />
          {showText && <span className={className}>Tseng Photography</span>}
        </Link>
      </Button>
    </div>
  );
}
