import { cn } from "@/lib/utils";
import * as React from "react";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full rounded-2xl border border-ink/25 bg-bone px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ink disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
