import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../utils";

const labelVariants = cva(
  "text-sm min-h-4 text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white",
);

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  // If the label is used for an individual Checkbox or RadioGroupItem, but not the parent RadioGroup
  inline?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps & VariantProps<typeof labelVariants>
>(({ className, inline = false, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      `${inline ? "h-6 pt-0.5 font-normal" : "font-medium"} ${labelVariants()}`,
      className,
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
