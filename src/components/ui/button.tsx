import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bone disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-field text-field-ink hover:bg-field-strong",
        destructive: "bg-[#8c2f24] text-bone hover:bg-[#73261e]",
        outline: "bg-surface text-ink hover:bg-surface-strong",
        secondary: "bg-surface text-ink hover:bg-surface-strong",
        ghost: "text-ink hover:bg-surface",
        link: "text-ink underline underline-offset-4 hover:decoration-2",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
