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
    <div className='flex items-center gap-3'>
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
          {showText && <span className={className}>Next Starter</span>}
        </Link>
      </Button>

      <Infinity size={iconSize} className={cn('text-muted-foreground', className)} />
      <Button variant='link' className={cn('p-0 m-0', className)}>
        <Link href='https://rinm.dev'>
          <Image
            src='/rmlogov2.png'
            alt='Logo'
            width={Math.round(iconSize * 1.5)}
            height={Math.round(iconSize * 1.5 * (1079 / 1905))}
            style={{ width: iconSize * 1.5, height: 'auto' }}
          />
        </Link>
      </Button>
    </div>
  );
}
