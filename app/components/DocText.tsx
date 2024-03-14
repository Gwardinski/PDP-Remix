import { Link } from "@remix-run/react";
import {
  Bug,
  CheckCircle,
  ExternalLink,
  Github,
  ListTodo,
  RefreshCw,
  Wrench,
  Youtube,
} from "lucide-react";
import { HTMLAttributes } from "react";

// TODO: Add cn to allow classname overwrites
export const DocumentationLink: React.FC<{
  href: string;
  text: string;
}> = ({ href, text }) => (
  <Link
    to={href}
    className="text-md flex w-fit items-center justify-center gap-4 underline"
  >
    <ExternalLink className="min-w-fit self-start text-blue-600 dark:text-blue-500" />{" "}
    {text}
  </Link>
);

export const VideoLink: React.FC<{
  href: string;
  text: string;
}> = ({ href, text }) => (
  <Link
    to={href}
    className="text-md flex w-fit items-start justify-start gap-4 underline"
  >
    <Youtube className="min-w-fit self-start text-red-600 dark:text-red-500" />{" "}
    {text}
  </Link>
);

export const GithubLink: React.FC<{
  href: string;
  text: string;
}> = ({ href, text }) => (
  <Link
    to={href}
    className="text-md flex w-fit items-center justify-center gap-4 underline"
  >
    <Github className="min-w-fit self-start" /> {text}
  </Link>
);

export const FunctionalText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="text-md flex w-fit items-center justify-center gap-4">
    <CheckCircle className="min-w-fit self-start text-green-600 dark:text-green-500" />{" "}
    {text}
  </div>
);

export const NonFunctionalText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="text-md flex w-fit items-center justify-center gap-4">
    <Wrench className="min-w-fit self-start text-orange-600 dark:text-orange-500" />{" "}
    {text}
  </div>
);

export const BugText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="text-md flex w-fit items-center justify-center gap-4 font-bold uppercase text-red-600 dark:text-red-500">
    <Bug className="min-w-fit self-start text-red-600 dark:text-red-500" />{" "}
    {text}
  </div>
);

export const RefreshText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="text-md flex w-fit items-center justify-center gap-4">
    <RefreshCw className="min-w-fit self-start" /> {text}
  </div>
);

export const TodoText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="text-md flex w-fit items-center justify-center gap-4">
    <ListTodo className=" min-w-fit self-start text-yellow-600 dark:text-yellow-500" />{" "}
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
