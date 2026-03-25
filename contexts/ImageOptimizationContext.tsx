'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface ImageOptimizationContextType {
  isOptimizationDisabled: boolean;
  disableOptimization: () => void;
}

const ImageOptimizationContext = createContext<ImageOptimizationContextType | undefined>(
  undefined
);

export function ImageOptimizationProvider({ children }: { children: ReactNode }) {
  const [isOptimizationDisabled, setIsOptimizationDisabled] = useState(false);

  const disableOptimization = () => {
    setIsOptimizationDisabled(true);
  };

  return (
    <ImageOptimizationContext.Provider
      value={{ isOptimizationDisabled, disableOptimization }}
    >
      {children}
    </ImageOptimizationContext.Provider>
  );
}

export function useImageOptimization() {
  const context = useContext(ImageOptimizationContext);
  if (context === undefined) {
    throw new Error(
      'useImageOptimization must be used within an ImageOptimizationProvider'
    );
  }
  return context;
}
