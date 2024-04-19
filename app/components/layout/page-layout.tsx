import { cn } from "../utils";

export function Page({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("flex h-full w-full flex-col gap-12 pb-40", className)}
      {...props}
    />
  );
}

export function PageHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <header className={cn("flex flex-col gap-2", className)} {...props} />;
}

export function PageHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass dark:dark-glass flex flex-col gap-2 rounded-lg p-4",
        className,
      )}
      {...props}
    />
  );
}

export function PageHeaderAccordion({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass dark:dark-glass flex min-w-fit max-w-lg rounded-md px-4 text-black dark:text-white lg:min-w-full",
        className,
      )}
      {...props}
    />
  );
}

export function PageTabContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("flex h-full w-full flex-col gap-10 pt-6", className)}
      {...props}
    />
  );
}

export function PageSection({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("flex h-full w-full flex-col gap-4", className)}
      {...props}
    />
  );
}

// Vertical, for text
export function PageSectionHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <header
      className={cn(
        "glass dark:dark-glass flex min-h-10 flex-col justify-between gap-2 rounded-lg p-4",
        className,
      )}
      {...props}
    />
  );
}

// Horizontal, for buttons, inputs
export function PageSectionActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <header
      className={cn(
        "glass dark:dark-glass flex min-h-10 flex-col gap-2 rounded-lg px-4 py-2 md:flex-row lg:items-center lg:justify-between ",
        className,
      )}
      {...props}
    />
  );
}
