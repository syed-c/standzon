import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target no-tap-highlight shadow-md hover:shadow-lg active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md active:bg-gray-100 active:scale-[0.98]',
        destructive:
          'bg-white text-red-600 border border-red-600 hover:bg-red-50 shadow-sm hover:shadow-md active:bg-red-100 active:scale-[0.98]',
        outline:
          'border-2 border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 shadow-sm hover:shadow-md active:bg-gray-100 active:scale-[0.98]',
        secondary:
          'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md active:bg-gray-100 active:scale-[0.98]',
        ghost: 'text-gray-900 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100 active:scale-[0.98]',
        link: 'text-gray-900 underline-offset-4 hover:text-gray-900 opacity-80 hover:opacity-100 active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-4 py-2 min-h-[44px]',
        sm: 'h-9 rounded-lg px-3 min-h-[40px] text-xs',
        lg: 'h-11 rounded-xl px-8 min-h-[48px]',
        icon: 'h-10 w-10 min-h-[44px] min-w-[44px] text-[#000000]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };