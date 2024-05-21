import { Link } from "@remix-run/react";
import { IconEyeCheck } from "@tabler/icons-react";
import { format } from "date-fns";
import { H4 } from "../ui";

type QuizCardLibraryProps = {
  zid: number;
  title: string;
  description: string | null;
  noOfRounds: number;
  noOfQuestions: number;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
  published: boolean;
};
export const QuizCardLibrary: React.FC<QuizCardLibraryProps> = ({
  zid,
  title,
  description,
  noOfRounds,
  noOfQuestions,
  totalPoints,
  createdAt,
  updatedAt,
  published,
}) => {
  return (
    <Link
      to={`/quiz/${zid}`}
      className="flex w-full flex-col gap-2 rounded-xl rounded-t-xl border px-4 pb-6 pt-4 shadow-md transition-all duration-100 hover:shadow-lg dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      <div className="flex justify-between gap-2 text-xs text-zinc-700 dark:text-zinc-300">
        <h6 className="tracking-wide text-orange-600 dark:text-orange-500">
          Quiz
        </h6>
        {createdAt && !updatedAt && (
          <time>{format(createdAt, "dd/MM/yyyy")}</time>
        )}
        {updatedAt && <time>{format(updatedAt, "dd/MM/yyyy")}</time>}
      </div>
      <div className="flex justify-between gap-1">
        <H4>{title}</H4>
        {published && <IconEyeCheck className="size-6 text-zinc-600" />}
      </div>
      <ul className="flex flex-col text-sm text-zinc-700 dark:text-zinc-300">
        <li>{noOfRounds ?? 0} Rounds</li>
        <li>{noOfQuestions ?? 0} Questions</li>
        <li>{totalPoints ?? 0} Total Points</li>
      </ul>
      <p className="flex h-5 flex-col overflow-hidden text-sm text-zinc-700 dark:text-zinc-300">
        {description}
      </p>
    </Link>
  );
};
