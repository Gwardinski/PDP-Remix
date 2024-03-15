import { Link } from "@remix-run/react";
import {
  IconBrandGithub,
  IconBrandYoutube,
  IconBug,
  IconCheckbox,
  IconChecklist,
  IconExternalLink,
  IconRefresh,
  IconTool,
} from "@tabler/icons-react";
import { HTMLAttributes } from "react";

// TODO: Add cn to allow classname overwrites
export const DocumentationLink: React.FC<{
  href: string;
  text: string;
}> = ({ href, text }) => (
  <Link
    to={href}
    className="flex w-fit items-center justify-center gap-3 hover:underline"
  >
    <IconExternalLink className="size-6 min-w-6 text-blue-600 dark:text-blue-500" />{" "}
    {text}
  </Link>
);

export const VideoLink: React.FC<{
  href: string;
  text: string;
}> = ({ href, text }) => (
  <Link
    to={href}
    className="flex w-fit items-center justify-center gap-3 hover:underline"
  >
    <IconBrandYoutube className="size-6 min-w-6 text-red-600 dark:text-red-500" />{" "}
    {text}
  </Link>
);

export const GithubLink: React.FC<{
  href: string;
  text: string;
}> = ({ href, text }) => (
  <Link
    to={href}
    className="flex w-fit items-center justify-center gap-3 hover:underline"
  >
    <IconBrandGithub className="size-6 min-w-6" /> {text}
  </Link>
);

export const FunctionalText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="flex w-fit items-center justify-center gap-3">
    <IconCheckbox className="size-6 min-w-6 text-green-600 dark:text-green-500" />{" "}
    {text}
  </div>
);

export const NonFunctionalText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="flex w-fit items-center justify-center gap-3">
    <IconTool className="size-6 min-w-6 text-orange-600 dark:text-orange-500" />{" "}
    {text}
  </div>
);

export const BugText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="flex w-fit items-center justify-center gap-3 font-semibold text-red-600 dark:text-red-500">
    <IconBug className="size-6 min-w-6 text-red-600 dark:text-red-500" /> {text}
  </div>
);

export const RefreshText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="flex w-fit items-center justify-center gap-3">
    <IconRefresh className="size-6 min-w-6" /> {text}
  </div>
);

export const TodoText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="flex w-fit items-center justify-center gap-3">
    <IconChecklist className=" size-6 min-w-6 text-yellow-600 dark:text-yellow-500" />{" "}
    <b className="-mr-2">TODO:</b>
    {text}
  </div>
);

export const CodeSnippet: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <code
    className="flex rounded-md bg-zinc-300 px-1 py-0.5 dark:bg-zinc-700"
    {...props}
  />
);
