'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  setLoading: (key: string, value: boolean) => void;
  isLoading: (key: string) => boolean;
  isAnyLoading: () => boolean;
  loadingStates: Map<string, boolean>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(new Map());

  const setLoading = (key: string, value: boolean) => {
    setLoadingStates((prev) => {
      const next = new Map(prev);
      if (value) {
        next.set(key, true);
      } else {
        next.delete(key);
      }
      return next;
    });
  };

  const isLoading = (key: string): boolean => {
    return loadingStates.get(key) ?? false;
  };

  const isAnyLoading = (): boolean => {
    return loadingStates.size > 0;
  };

  return (
    <LoadingContext.Provider
      value={{ setLoading, isLoading, isAnyLoading, loadingStates }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
