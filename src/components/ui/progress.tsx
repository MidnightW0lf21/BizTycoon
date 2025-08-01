
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { 
    indicatorClassName?: string;
    orientation?: "horizontal" | "vertical";
  }
>(({ className, value, indicatorClassName, orientation = "horizontal", ...props }, ref) => {
  const isVertical = orientation === 'vertical';

  if (isVertical) {
    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full h-full overflow-hidden rounded-lg bg-secondary",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "absolute bottom-0 left-0 w-full bg-primary transition-all rounded-lg",
            indicatorClassName
          )}
          style={{ height: `${value || 0}%` }}
        />
      </ProgressPrimitive.Root>
    )
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 bg-primary transition-all",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
