import { HTMLAttributes } from "react";

// TODO: Add cn to enable classname overwrites
export const PageLayout: React.FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <section className="flex h-full flex-col gap-4 pb-40" {...props} />
);

export const PageHeader: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <header
    className="flex flex-col gap-4 border-zinc-300 dark:border-zinc-700"
    {...props}
  />
);

export const PageTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <h1
    className="bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text text-4xl font-extrabold tracking-wider text-transparent dark:from-zinc-100 dark:to-zinc-400"
    {...props}
  />
);

export const PageHeading: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <h2
    className="bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text text-3xl font-bold tracking-wide text-transparent dark:from-zinc-100 dark:to-zinc-400"
    {...props}
  />
);

export const PageAccordionDescription: React.FC<
  HTMLAttributes<HTMLHeadingElement>
> = (props) => (
  <h3
    className="flex min-w-fit max-w-lg flex-col gap-2 rounded-md bg-zinc-200 px-4 text-black dark:bg-zinc-800 dark:text-white lg:min-w-full"
    {...props}
  />
);

export const PageDescription: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <h4
    className="flex min-w-fit max-w-lg flex-col gap-2 rounded-md bg-zinc-200 p-4 pr-8 dark:bg-zinc-800 lg:pr-12"
    {...props}
  />
);

export const DataContainer: React.FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    className="flex w-fit min-w-60 flex-col gap-2 rounded-md border-2 border-dashed border-zinc-400 bg-zinc-50 p-4 pr-8 dark:border-zinc-600 dark:bg-zinc-800 lg:pr-12"
    {...props}
  />
);

// Nested Pages

export const PageNestedLayout: React.FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => <section className="mt-4 flex h-full flex-col gap-4" {...props} />;

export const PageNestedHeader: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => <header className="flex flex-col gap-4 " {...props} />;
