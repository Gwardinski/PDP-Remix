import { cn } from "../utils";

export function RoundGrid({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
      {...props}
    />
  );
}
