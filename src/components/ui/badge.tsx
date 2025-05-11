import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Modern badge/pill component for status or highlights.
 */
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-block rounded-full px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-900',
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';
