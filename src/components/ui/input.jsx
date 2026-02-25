import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base layout & typography
        "flex h-10 w-full min-w-0 rounded-md border px-3 py-2 text-sm text-gray-700",
        // Match the screenshot: light gray background + subtle border
        "bg-white border-gray-300",
        // Placeholder
        "placeholder:text-gray-400",
        // Smooth transitions
        "transition-[border-color,box-shadow] duration-150 outline-none",
        // Focus: gray ring to stay consistent with the form style
        "focus-visible:border-gray-500 focus-visible:ring-[3px] focus-visible:ring-gray-500/15",
        // Error state
        "aria-invalid:border-red-400 aria-invalid:ring-[3px] aria-invalid:ring-red-400/20",
        // Disabled state
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // File input styling
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Dark mode
        "dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500",
        "dark:focus-visible:border-gray-400 dark:focus-visible:ring-gray-400/20",
        className
      )}
      {...props}
    />
  );
}

export { Input }