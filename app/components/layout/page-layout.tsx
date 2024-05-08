import { HTMLAttributes } from "react";
import { cn } from "../utils";

export function Page({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("flex h-full w-full flex-col gap-4 pb-40", className)}
      {...props}
    />
  );
}

export function PageHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-zinc-300 dark:border-zinc-700",
        className,
      )}
      {...props}
    />
  );
}

export function PageContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("flex h-full w-full flex-col gap-10", className)}
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

export function PageContentHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <header
      className={cn(
        "flex min-h-10 gap-4 border-zinc-300 dark:border-zinc-700",
        className,
      )}
      {...props}
    />
  );
}

export function PageSectionList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex h-full w-full flex-col gap-16 pt-6", className)}
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

export function PageSectionHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <header
      className={cn(
        "flex min-h-10 justify-between gap-4 border-zinc-300 dark:border-zinc-700",
        className,
      )}
      {...props}
    />
  );
}

export const PageAccordion: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  // eslint-disable-next-line jsx-a11y/heading-has-content
  <h3
    className="flex min-w-fit max-w-lg rounded-md bg-zinc-200 px-4 text-black dark:bg-zinc-800 dark:text-white lg:min-w-full"
    {...props}
  />
);

export const SectionHeading: React.FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div className="flex flex-col gap-1" {...props} />;
