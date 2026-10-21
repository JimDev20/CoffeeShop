import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-field text-field-ink",
        secondary: "bg-surface text-ink",
        success: "bg-[#dfe4c9] text-[#2f3a0c]",
        warning: "bg-[#efe3c4] text-[#5a4712]",
        destructive: "bg-[#efd9d4] text-[#7a2a1f]",
        outline: "bg-surface text-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
