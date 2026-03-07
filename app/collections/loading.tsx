import { Skeleton } from '@/components/ui';
import { getDelayClass } from '@/utils/animations';

export default function CollectionsLoading() {
  return (
    <div className='container mx-auto px-4 pb-4 nb-padding'>
      {/* Header Skeleton */}
      <div className='mb-12 text-center space-y-4'>
        <div className={`fade-in-from-bottom ${getDelayClass(0)}`}>
          <Skeleton className='h-12 w-64 mx-auto' />
        </div>
        <div className={`fade-in-from-bottom ${getDelayClass(1)}`}>
          <Skeleton className='h-6 w-96 mx-auto' />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`space-y-4 fade-in-from-bottom ${getDelayClass(i + 2)}`}
          >
            <Skeleton className='aspect-4/3 w-full' />
            <div className='space-y-2'>
              <Skeleton className='h-6 w-3/4' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-2/3' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
