import { cn } from "../utils";

export function QuizGrid({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3",
        className,
      )}
      {...props}
    />
  );
}
