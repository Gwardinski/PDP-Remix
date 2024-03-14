import { cn } from "../utils";

export interface TextProps extends React.HTMLAttributes<HTMLHeadingElement> {}

// Page Heading
export function H1({ className, ...props }: TextProps) {
  return (
    <h1
      className={cn(
        "bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text text-4xl font-extrabold tracking-wider text-transparent dark:from-zinc-100 dark:to-zinc-400",
        className,
      )}
      {...props}
    />
  );
}

// Page Description
export function H1Description({ className, ...props }: TextProps) {
  return (
    <p
      className={cn(
        "text-xl tracking-wide text-zinc-800 dark:text-zinc-300",
        className,
      )}
      {...props}
    />
  );
}

// Section Heading
export function H2({ className, ...props }: TextProps) {
  return (
    <h2
      className={cn(
        "bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text text-3xl font-bold tracking-wide text-transparent dark:from-zinc-100 dark:to-zinc-400",
        className,
      )}
      {...props}
    />
  );
}

// Section Description
export function H2Description({ className, ...props }: TextProps) {
  return (
    <p
      className={cn("text-md text-zinc-700 dark:text-zinc-300", className)}
      {...props}
    />
  );
}

// Form Heading
export function H3({ className, ...props }: TextProps) {
  return (
    <h3
      className={cn("text-lg text-zinc-800 dark:text-zinc-200", className)}
      {...props}
    />
  );
}

// Form Description
export function H3Description({ className, ...props }: TextProps) {
  return (
    <p
      className={cn(
        "text-lg leading-4 text-zinc-800 dark:text-zinc-200",
        className,
      )}
      {...props}
    />
  );
}

// Card Heading
export function H4({ className, ...props }: TextProps) {
  return (
    <h4
      className={cn(
        "text-lg leading-4 text-zinc-800 dark:text-zinc-200",
        className,
      )}
      {...props}
    />
  );
}

// Form Description
export function H4Description({ className, ...props }: TextProps) {
  return (
    <p
      className={cn(
        "text-lg leading-4 text-zinc-800 dark:text-zinc-200",
        className,
      )}
      {...props}
    />
  );
}
