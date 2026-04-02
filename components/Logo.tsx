import { Button } from '@/components/animate-ui/components/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showText?: boolean;
  onClick?: () => void;
}

export function Logo({ className, showText = true, onClick }: LogoProps) {
  return (
    <div className='flex items-center justify-center'>
      <Button variant='link' className='p-0 m-0'>
        <Link
          href='/'
          className={cn('flex items-center gap-2', className)}
          onClick={onClick}
        >
          {showText && <span className={className}>Tseng Photography</span>}
        </Link>
      </Button>
    </div>
  );
}
