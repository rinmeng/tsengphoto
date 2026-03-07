import { Skeleton } from '@/components/ui';
import { getDelayClass } from '@/utils/animations';

export default function CollectionLoading() {
  return (
    <div className='container mx-auto px-4 pb-4 nb-padding fade-in-from-bottom'>
      <div className={`mb-8 fade-in-from-top ${getDelayClass(0)}`}>
        <Skeleton className='h-10 w-40' />
      </div>

      {/* Header Skeleton */}
      <div className='mb-12 space-y-6'>
        <div className='space-y-2'>
          <div className={`fade-in-from-top ${getDelayClass(1)}`}>
            <Skeleton className='h-6 w-20' />
          </div>
          <div className={`fade-in-from-top ${getDelayClass(2)}`}>
            <Skeleton className='h-12 w-96' />
          </div>
        </div>
        <div className={`fade-in-from-top ${getDelayClass(3)}`}>
          <Skeleton className='h-6 w-full max-w-3xl' />
        </div>
        <div className={`fade-in-from-top ${getDelayClass(4)}`}>
          <Skeleton className='h-6 w-2/3 max-w-3xl' />
        </div>
        <div className='flex gap-6'>
          <div className={`fade-in-from-top ${getDelayClass(5)}`}>
            <Skeleton className='h-6 w-32' />
          </div>
          <div className={`fade-in-from-top ${getDelayClass(6)}`}>
            <Skeleton className='h-6 w-32' />
          </div>
          <div className={`fade-in-from-top ${getDelayClass(7)}`}>
            <Skeleton className='h-6 w-24' />
          </div>
        </div>
      </div>

      {/* Gallery Skeleton */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`fade-in-from-top ${getDelayClass(i + 8)}`}>
            <Skeleton className='aspect-16/10' />
          </div>
        ))}
      </div>
    </div>
  );
}
