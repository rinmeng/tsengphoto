'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import Fuse, { type FuseResult } from 'fuse.js';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface SearchAndFilterBarProps<T> {
  items: T[];
  searchKeys: string[];
  onFilteredResults: (results: T[], isFiltered: boolean) => void;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: searchKeys,
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [items, searchKeys]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on "/"
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Clear search on "Escape"
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setSearchQuery('');
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Apply search filter
  useEffect(() => {
    const isSearching = debouncedQuery.trim().length > 0;

    if (isSearching) {
      const searchResults = fuse.search(debouncedQuery);
      const results = searchResults.map((result: FuseResult<T>) => result.item);
      onFilteredResults(results, true);
    } else {
      onFilteredResults(items, false);
    }
  }, [debouncedQuery, items, fuse, onFilteredResults]);

  const displayedCount = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return items.length;
    }
    return fuse.search(debouncedQuery).length;
  }, [debouncedQuery, items, fuse]);

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className='flex flex-col md:flex-row items-center gap-3 w-full'>
        {/* Search Input */}
        <div className='relative w-full md:w-2/3 mx-auto'>
          <Search
            className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4
              text-muted-foreground'
          />
          <Input
            ref={inputRef}
            type='text'
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='text-center pl-10 pr-10'
          />
          {searchQuery && (
            <X
              className='absolute right-3 top-1/2 transform -translate-y-1/2 size-5
                text-muted-foreground cursor-pointer hover:text-foreground
                transition-colors'
              onClick={() => setSearchQuery('')}
            />
          )}
        </div>
      </div>

      {/* Results Badge */}
      <Badge variant='secondary' className='shrink-0'>
        {displayedCount} {countLabel}
        {debouncedQuery && ` found for "${debouncedQuery}"`}
      </Badge>
    </div>
  );
}
