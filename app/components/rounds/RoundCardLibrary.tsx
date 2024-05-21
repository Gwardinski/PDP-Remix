import { Link } from "@remix-run/react";
import { format } from "date-fns";

import { IconEyeCheck } from "@tabler/icons-react";
import { Button, H4 } from "../ui";

type RoundCardLibraryProps = {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  noOfQuestions: number;
  noOfQuizzes: number;
  published: boolean;
  isPending: boolean;
  addToPath: string;
};
export const RoundCardLibrary: React.FC<RoundCardLibraryProps> = ({
  id,
  title,
  description,
  createdAt,
  updatedAt,
  noOfQuestions,
  noOfQuizzes,
  published,
  isPending,
  addToPath,
}) => {
  return (
    <div className="flex flex-col rounded-xl rounded-t-xl border shadow-md dark:border-zinc-700">
      <Link
        key={id}
        to={`/round/${id}`}
        className="flex flex-col gap-2 rounded-t-xl px-4 pb-6 pt-4 transition-all duration-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <div className="flex justify-between gap-2 text-xs text-zinc-700 dark:text-zinc-300">
          <h6 className="tracking-wide text-orange-600 dark:text-orange-500">
            Round
          </h6>
          {createdAt && !updatedAt && (
            <time>{format(createdAt, "dd/MM/yyyy")}</time>
          )}
          {updatedAt && <time>{format(updatedAt, "dd/MM/yyyy")}</time>}
        </div>
        <div className="flex justify-between gap-1">
          <H4 className="font-bold">{title}</H4>
          {published && <IconEyeCheck className="size-6 text-zinc-600" />}
        </div>
        <ul className="flex flex-col text-sm text-zinc-700 dark:text-zinc-300">
          <li>{noOfQuestions} Questions</li>
          <li>Used in {noOfQuizzes} Quizzes</li>
        </ul>
        <p className="flex h-5 flex-col overflow-hidden text-sm text-zinc-700 dark:text-zinc-300">
          {description}
        </p>
      </Link>

      <div className="flex w-full">
        <Button
          disabled={isPending}
          variant="outline"
          asChild
          className="w-full overflow-hidden rounded-b-xl rounded-t-none border-none"
        >
          <Link to={addToPath}>Add To Quiz</Link>
        </Button>
      </div>
    </div>
  );
};
