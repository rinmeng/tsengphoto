'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import {
  Checkbox as CheckboxPrimitive,
  CheckboxIndicator as CheckboxIndicatorPrimitive,
  type CheckboxProps as CheckboxPrimitiveProps,
  type CheckboxIndicatorProps as CheckboxIndicatorPrimitiveProps,
} from '@/components/animate-ui/primitives/radix/checkbox';
import { cn } from '@/lib/utils';

const checkboxVariants = cva(
  'flex justify-center items-center border transition-colors data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  {
    variants: {
      size: {
        sm: 'size-4',
        default: 'size-5',
        lg: 'size-6',
      },
      variant: {
        default: '',
        overlay: 'bg-background/80 backdrop-blur-sm',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

const checkboxIndicatorVariants = cva('', {
  variants: {
    size: {
      sm: 'size-3',
      default: 'size-3.5',
      lg: 'size-4',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type CheckboxProps = CheckboxPrimitiveProps & VariantProps<typeof checkboxVariants>;

function Checkbox({ className, size, variant, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive
      className={cn(checkboxVariants({ size, variant, className }))}
      {...props}
    />
  );
}

type CheckboxIndicatorProps = CheckboxIndicatorPrimitiveProps &
  VariantProps<typeof checkboxIndicatorVariants>;

function CheckboxIndicator({ className, size, ...props }: CheckboxIndicatorProps) {
  return (
    <CheckboxIndicatorPrimitive
      className={cn(checkboxIndicatorVariants({ size, className }))}
      {...props}
    />
  );
}

export { Checkbox, CheckboxIndicator, checkboxVariants, type CheckboxProps };
