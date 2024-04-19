import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { cn } from "../utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <div className="flex items-center justify-center gap-3 pb-2">
    <h6 className="text-sm text-zinc-700">{props.min}</h6>

    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <SliderPrimitive.Range className="absolute h-full bg-zinc-900 dark:bg-zinc-50" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-900 bg-zinc-100 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-50 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300">
        {props.value}
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
    <h6 className="text-sm text-zinc-700">{props.max}</h6>
  </div>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
