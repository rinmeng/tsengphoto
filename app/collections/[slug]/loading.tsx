import { Skeleton } from '@/components/ui';

export default function CollectionLoading() {
  return (
    <div className='container mx-auto px-4 nb-padding fade-in-from-bottom'>
      <div className='mb-8'>
        <Skeleton className='h-10 w-40' />
      </div>

      {/* Header Skeleton */}
      <div className='mb-12 space-y-6'>
        <div className='space-y-2'>
          <Skeleton className='h-6 w-20' />
          <Skeleton className='h-12 w-96' />
        </div>
        <Skeleton className='h-6 w-full max-w-3xl' />
        <Skeleton className='h-6 w-2/3 max-w-3xl' />
        <div className='flex gap-6'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-6 w-24' />
        </div>
      </div>

      {/* Gallery Skeleton */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <Skeleton className='md:col-span-2 md:row-span-2 aspect-16/10' />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='aspect-square' />
        ))}
      </div>
    </div>
  );
}
