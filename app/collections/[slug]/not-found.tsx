import Link from 'next/link';
import { Button } from '@/components/ui';
import { Text } from '@/components/Text';
import { ArrowLeft, ImageOff } from 'lucide-react';

export default function CollectionNotFound() {
  return (
    <div className='container mx-auto px-4 nb-padding fade-in-from-bottom'>
      <div className='max-w-md mx-auto text-center space-y-6'>
        <div className='flex justify-center'>
          <ImageOff className='size-20 text-muted-foreground' />
        </div>

        <div className='space-y-2 fade-in-from-bottom'>
          <Text variant='hd-xl'>Collection Not Found</Text>
          <Text variant='bd-lg' className='text-muted-foreground'>
            The collection you&apos;re looking for doesn&apos;t exist or has been removed.
          </Text>
        </div>

        <Link href='/collections'>
          <Button className='gap-2 fade-in-from-bottom'>
            <ArrowLeft className='size-4' />
            Back to Collections
          </Button>
        </Link>
      </div>
    </div>
  );
}
