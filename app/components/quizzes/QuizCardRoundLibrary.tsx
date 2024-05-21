import { Link } from "@remix-run/react";
import { IconEyeCheck } from "@tabler/icons-react";
import { format } from "date-fns";
import { ButtonHTMLAttributes } from "react";
import { Button, H4 } from "../ui";

interface QuizCardRoundLibraryProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  zid: number;
  title: string;
  description: string | null;
  noOfRounds: number;
  noOfQuestions: number;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}
export const QuizCardRoundLibrary: React.FC<QuizCardRoundLibraryProps> = ({
  zid,
  title,
  description,
  noOfRounds,
  noOfQuestions,
  totalPoints,
  createdAt,
  updatedAt,
  published,
  ...rest
}) => {
  return (
    <div className="flex flex-col rounded-xl rounded-t-xl border shadow-md dark:border-zinc-700">
      <Link
        to={`/quiz/${zid}`}
        className="flex flex-col gap-2 rounded-t-xl px-4 pb-6 pt-4 transition-all duration-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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

      <div className="flex w-full">
        <Button
          variant="outline"
          className="w-full overflow-hidden rounded-b-xl rounded-t-none border-none"
          {...rest}
        >
          Add To This Quiz
        </Button>
      </div>
    </div>
  );
};
