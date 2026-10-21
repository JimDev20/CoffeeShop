import { cn } from "@/lib/utils";
import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-full border border-ink/25 bg-bone px-4 py-2 text-sm text-ink placeholder:text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ink disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
