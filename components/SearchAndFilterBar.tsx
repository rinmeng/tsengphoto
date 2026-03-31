'use client';

import { Button } from '@/components/animate-ui/components/';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import Fuse, { type FuseResult } from 'fuse.js';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

// Type helper for items that might have these properties
type SortableItem = {
  title?: string;
  date?: string;
  type?: string;
  collection_group_name?: string;
};

interface SearchAndFilterBarProps<T> {
  items: T[];
  searchKeys: string[];
  onFilteredResults: (results: T[], isFiltered: boolean) => void;
  placeholder?: string;
  countLabel?: string;
  className?: string;
  // URL-based filter state
  searchQuery?: string;
  groupFilter?: string | null;
  availableGroups?: string[];
  // Callbacks to update URL params
  onSearchChange?: (query: string) => void;
  onGroupFilterChange?: (group: string | null) => void;
}

export function SearchAndFilterBar<T>({
  items,
  searchKeys,
  onFilteredResults,
  placeholder = 'Search...',
  countLabel = 'items',
  className = '',
  searchQuery: propSearchQuery = '',
  groupFilter = null,
  availableGroups = [],
  onSearchChange,
  onGroupFilterChange,
}: SearchAndFilterBarProps<T>) {
  // Use local state for immediate UI updates, sync with props
  const [localSearchQuery, setLocalSearchQuery] = useState(propSearchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(localSearchQuery, 300);
  const prevQueryRef = useRef<string | undefined>(undefined);
  const prevGroupFilterRef = useRef<string | null | undefined>(undefined);
  const prevItemsLengthRef = useRef<number | undefined>(undefined);

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: searchKeys,
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [items, searchKeys]);

  // Sync local search with prop when prop changes externally
  useEffect(() => {
    setLocalSearchQuery(propSearchQuery);
  }, [propSearchQuery]);

  // Sync debounced query to URL via callback
  useEffect(() => {
    if (debouncedQuery !== propSearchQuery) {
      onSearchChange?.(debouncedQuery);
    }
  }, [debouncedQuery, onSearchChange, propSearchQuery]);

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
        setLocalSearchQuery('');
        onSearchChange?.('');
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchChange]);

  // Apply search and group filter
  useEffect(() => {
    // Skip if nothing has changed
    if (
      prevQueryRef.current === debouncedQuery &&
      prevGroupFilterRef.current === groupFilter &&
      prevItemsLengthRef.current === items.length
    ) {
      return;
    }
    prevQueryRef.current = debouncedQuery;
    prevGroupFilterRef.current = groupFilter;
    prevItemsLengthRef.current = items.length;

    let results: T[] = [];
    const isSearching = debouncedQuery.trim().length > 0;

    if (isSearching) {
      const searchResults = fuse.search(debouncedQuery);
      results = searchResults.map((result: FuseResult<T>) => result.item);
    } else {
      results = [...items];
    }

    // Apply group filter
    if (groupFilter) {
      results = results.filter(
        (item) => (item as unknown as SortableItem).collection_group_name === groupFilter
      );
    }

    onFilteredResults(results, isSearching || !!groupFilter);
  }, [debouncedQuery, fuse, onFilteredResults, items, groupFilter]);

  const displayedCount = useMemo(() => {
    let count = items.length;

    if (debouncedQuery.trim()) {
      count = fuse.search(debouncedQuery).length;
    }

    if (groupFilter) {
      const filtered = items.filter(
        (item) => (item as unknown as SortableItem).collection_group_name === groupFilter
      );
      count = debouncedQuery.trim()
        ? fuse
            .search(debouncedQuery)
            .filter(
              (result) =>
                (result.item as unknown as SortableItem).collection_group_name ===
                groupFilter
            ).length
        : filtered.length;
    }

    return count;
  }, [debouncedQuery, items, fuse, groupFilter]);

  const handleClearFilters = () => {
    setLocalSearchQuery('');
    onSearchChange?.('');
    onGroupFilterChange?.(null);
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className='flex flex-col items-center gap-3 w-full justify-center'>
        {/* Search Input */}
        <div className='relative w-full md:w-2/3'>
          <Search
            className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4
              text-muted-foreground'
          />
          <Input
            ref={inputRef}
            type='text'
            placeholder={placeholder}
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className='text-center pl-10 pr-10'
          />
          {localSearchQuery && (
            <X
              className='absolute right-3 top-1/2 transform -translate-y-1/2 size-5
                text-muted-foreground cursor-pointer hover:text-foreground
                transition-colors'
              onClick={() => {
                setLocalSearchQuery('');
                inputRef.current?.blur();
              }}
            />
          )}
        </div>
        <div className='flex items-center gap-2 w-full sm:w-1/3 justify-center'>
          <Select
            value={groupFilter || 'all'}
            onValueChange={(value) =>
              onGroupFilterChange?.(value === 'all' ? null : value)
            }
          >
            <SelectTrigger className='w-full [&>span]:flex-1 [&>span]:text-center'>
              <SelectValue placeholder='Group by' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Group by</SelectLabel>
                <SelectItem value='all'>All Groups</SelectItem>
                {availableGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Badge */}
      <Badge variant='secondary' className='shrink-0'>
        {displayedCount} {countLabel}
        {debouncedQuery && ` found for "${debouncedQuery}"`}
        {groupFilter && ` in "${groupFilter}"`}
      </Badge>

      {/* Clear Filters Button */}
      {(debouncedQuery || groupFilter) && (
        <Button variant='outline' size='sm' onClick={handleClearFilters}>
          <X className='size-4' />
          Clear all filters
        </Button>
      )}
    </div>
  );
}
