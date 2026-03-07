import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import React from 'react';

const textVariants = cva('', {
  variants: {
    variant: {
      // Headings - hd-xs (smallest) to hd-xxl (largest)
      'hd-xs': 'text-sm md:text-base lg:text-lg font-semibold',
      'hd-sm': 'text-base md:text-lg lg:text-xl font-semibold',
      'hd-md': 'text-lg md:text-xl lg:text-2xl font-bold',
      'hd-lg': 'text-xl md:text-2xl lg:text-3xl font-bold',
      'hd-xl': 'text-2xl md:text-4xl lg:text-5xl font-bold',
      'hd-xxl': 'text-3xl md:text-5xl lg:text-6xl font-bold',

      // Body text - bd-xs (smallest) to bd-xxl (largest)
      'bd-xs': 'text-xs md:text-sm',
      'bd-sm': 'text-sm md:text-base',
      'bd-md': 'text-sm md:text-base lg:text-lg',
      'bd-lg': 'text-base md:text-lg lg:text-xl',
      'bd-xl': 'text-lg md:text-xl lg:text-2xl',
      'bd-xxl': 'text-xl md:text-2xl lg:text-3xl',

      // Special variants
      caption: 'text-xs md:text-sm text-muted-foreground',
      label: 'text-sm md:text-base font-medium',
      muted: 'text-sm md:text-base text-muted-foreground',
      'muted-sm': 'text-xs md:text-sm text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'bd-md',
  },
});

type TextVariant = VariantProps<typeof textVariants>['variant'];

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  children: React.ReactNode;
}

const VARIANT_ELEMENT_MAP: Record<NonNullable<TextVariant>, React.ElementType> = {
  'hd-xxl': 'h1',
  'hd-xl': 'h2',
  'hd-lg': 'h3',
  'hd-md': 'h4',
  'hd-sm': 'h5',
  'hd-xs': 'h6',
  'bd-xxl': 'p',
  'bd-xl': 'p',
  'bd-lg': 'p',
  'bd-md': 'p',
  'bd-sm': 'p',
  'bd-xs': 'p',
  caption: 'p',
  label: 'label',
  muted: 'p',
  'muted-sm': 'p',
};

export function Text({ variant = 'bd-md', className, children, ...props }: TextProps) {
  const Comp = VARIANT_ELEMENT_MAP[variant ?? 'bd-md'];

  return (
    <Comp className={cn(textVariants({ variant }), className)} {...props}>
      {children}
    </Comp>
  );
}
