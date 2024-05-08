import { cn } from "./utils";

export function NoContentContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-800 p-4 text-center",
        className,
      )}
      {...props}
    />
  );
}
