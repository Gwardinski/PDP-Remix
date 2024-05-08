import { Link } from "@remix-run/react";
import { IconEyeCheck } from "@tabler/icons-react";
import { format } from "date-fns";
import { H4 } from "../ui";

type QuizItemLibraryProps = {
  id: number;
  title: string;
  description: string | null;
  noOfRounds: number;
  noOfQuestions: number;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
  published: boolean;
};
export const QuizItemLibrary: React.FC<QuizItemLibraryProps> = ({
  id,
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
      key={id}
      to={`/quiz/${id}`}
      className="flex w-full flex-col gap-2 rounded-xl rounded-t-xl border border-zinc-700 px-4 pb-6 pt-4 hover:bg-zinc-800"
    >
      <div className="flex justify-between gap-2 text-xs text-zinc-300">
        <h6 className="tracking-wide">Quiz</h6>
        {createdAt && !updatedAt && (
          <time className="text-xs text-zinc-300">
            {format(createdAt, "dd/MM/yyyy")}
          </time>
        )}
        {updatedAt && (
          <time className="text-xs text-zinc-300">
            {format(updatedAt, "dd/MM/yyyy")}
          </time>
        )}
      </div>
      <div className="flex justify-between gap-1">
        <H4 className="font-bold">{title}</H4>
        {published && <IconEyeCheck className="size-6 text-zinc-600" />}
      </div>
      <div className="flex flex-col">
        <h6 className="text-sm text-zinc-300">{noOfRounds ?? 0} Rounds</h6>
        <h6 className="text-sm text-zinc-300">
          {noOfQuestions ?? 0} Questions
        </h6>
        <h6 className="text-sm text-zinc-300">
          {totalPoints ?? 0} Total Points
        </h6>
      </div>
      <h6 className="h-5 overflow-hidden text-zinc-300">{description}</h6>
    </Link>
  );
};
