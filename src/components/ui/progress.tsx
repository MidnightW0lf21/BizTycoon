
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }
>(({ className, value, indicatorClassName, ...props }, ref) => {
  const isVertical = className?.includes('vertical');

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative w-full h-4 overflow-hidden rounded-full bg-secondary",
        isVertical && "h-full w-4",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 bg-primary transition-all",
          isVertical && "w-full rounded-none rounded-b-lg", // Adjusted for vertical
          !isVertical && "rounded-full",
          indicatorClassName
        )}
        style={{
          transform: isVertical
            ? `translateY(${100 - (value || 0)}%)`
            : `translateX(-${100 - (value || 0)}%)`
        }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
