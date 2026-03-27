'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Fuse, { type FuseResult } from 'fuse.js';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface SearchAndFilterBarProps<T> {
  items: T[];
  searchKeys: string[];
  onFilteredResults: (results: T[]) => void;
  placeholder?: string;
  countLabel?: string;
  className?: string;
}

export function SearchAndFilterBar<T>({
  items,
  searchKeys,
  onFilteredResults,
  placeholder = 'Search...',
  countLabel = 'items',
  className = '',
}: SearchAndFilterBarProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: searchKeys,
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [items, searchKeys]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      onFilteredResults(items);
      return;
    }

    const results = fuse.search(searchQuery);
    const filteredItems = results.map((result: FuseResult<T>) => result.item);
    onFilteredResults(filteredItems);
  }, [searchQuery, items, fuse, onFilteredResults]);

  const displayedCount = useMemo(() => {
    if (!searchQuery.trim()) {
      return items.length;
    }
    return fuse.search(searchQuery).length;
  }, [searchQuery, items, fuse]);

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className='relative w-full md:w-1/2'>
        <Search
          className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4
            text-muted-foreground'
        />
        <Input
          type='text'
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='text-center'
        />
        <X
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 size-5
            text-muted-foreground cursor-pointer ${searchQuery ? 'block' : 'hidden'}`}
          onClick={() => setSearchQuery('')}
        />
      </div>
      <Badge variant='secondary' className='shrink-0'>
        {displayedCount} {countLabel} {searchQuery && `found for "${searchQuery}"`}
      </Badge>
    </div>
  );
}
