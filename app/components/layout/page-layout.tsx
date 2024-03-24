import { HTMLAttributes } from "react";

// TODO: Add cn to enable classname overwrites
export const PageLayout: React.FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <section className="flex h-full w-full flex-col gap-4 pb-40" {...props} />
);

export const PageHeader: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <header
    className="flex flex-col gap-4 border-zinc-300 dark:border-zinc-700"
    {...props}
  />
);

export const PageHeading: React.FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div className="flex flex-col gap-1" {...props} />;

export const PageAccordion: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <h3
    className="flex min-w-fit max-w-lg rounded-md bg-zinc-200 px-4 text-black dark:bg-zinc-800 dark:text-white lg:min-w-full"
    {...props}
  />
);

export const SectionHeading: React.FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div className="flex flex-col gap-1" {...props} />;
