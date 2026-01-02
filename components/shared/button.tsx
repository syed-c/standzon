import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target no-tap-highlight shadow-md hover:shadow-lg active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-[#3C4A6B] text-[#FFFFFF] hover:bg-[#55689A] shadow-lg hover:shadow-xl active:bg-[#55689A] active:scale-[0.98]',
        destructive:
          'bg-[#FF5C5C] text-[#FFFFFF] hover:bg-[#FF7070] shadow-lg hover:shadow-xl active:bg-[#FF7070] active:scale-[0.98]',
        outline:
          'border-2 border-[rgba(255,255,255,0.25)] bg-[#29344D] text-[#FFFFFF] hover:bg-[#3C4A6B] hover:text-[#FFFFFF] hover:border-[rgba(255,255,255,0.5)] shadow-md hover:shadow-lg active:bg-[#3C4A6B] active:scale-[0.98]',
        secondary:
          'bg-[#29344D] text-[#FFFFFF] hover:bg-[#3C4A6B] shadow-md hover:shadow-lg active:bg-[#3C4A6B] active:scale-[0.98]',
        ghost: 'text-[#E2E8F0] hover:bg-[#29344D] hover:text-[#FFFFFF] active:bg-[#29344D] active:scale-[0.98]',
        link: 'text-[#3C4A6B] underline-offset-4 hover:text-[#FFFFFF] active:text-[#FFFFFF] active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-4 py-2 min-h-[44px]',
        sm: 'h-9 rounded-lg px-3 min-h-[40px] text-xs',
        lg: 'h-11 rounded-xl px-8 min-h-[48px]',
        icon: 'h-10 w-10 min-h-[44px] min-w-[44px]',
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