import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-xl border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-white hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-black',
        lightred: 'border-transparent bg-[#FEF2F2] text-destructive',
        lightblue: 'border-transparent bg-[#EFF6FF] text-[#2563EB]', 
        lightgreen: 'border-transparent bg-[#ECFDF5] text-[#059669]',
        lightyellow: 'border-transparent bg-[#FEFCE8] text-[#CA8A04]', 
        lightorange: 'border-transparent bg-[#FFF7ED] text-[#EA580C]',
        lightpurple: 'border-transparent bg-[#F3E8FF] text-[#7C3AED]', 
        lightpink: 'border-transparent bg-[#FDF2F8] text-[#DB2777]', 
        lightteal: 'border-transparent bg-[#F0FDFA] text-[#0D9488]', 
        lightindigo: 'border-transparent bg-[#EEF2FF] text-[#4F46E5]', 
        lightgray: 'border-transparent bg-[#F3F4F6] text-[#374151]',
        lightlime: 'border-transparent bg-[#F7FEE7] text-[#65A30D]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
