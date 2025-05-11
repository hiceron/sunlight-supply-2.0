import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

/**
 * Modern, accessible button component following design system.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = 'button', asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          'bg-primary text-white hover:bg-primary/90 px-4 py-2',
          className
        )}
        type={asChild ? undefined : type}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
