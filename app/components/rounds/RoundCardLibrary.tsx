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
    <div className="flex flex-col rounded-xl border border-zinc-700">
      <Link key={id} to={`/round/${id}`}>
        <div className="flex w-full flex-col gap-2 rounded-t-xl border-b border-zinc-700 px-4 pb-6 pt-4 hover:bg-zinc-800">
          <div className="flex justify-between gap-2 text-xs text-zinc-300">
            <h6 className="tracking-wide">Round</h6>

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
            <h6 className="text-sm text-zinc-300">{noOfQuestions} Questions</h6>
            <h6 className="text-sm text-zinc-300">
              Used in {noOfQuizzes} Quizzes
            </h6>
          </div>
          <h6 className="h-5 overflow-hidden text-zinc-300">{description}</h6>
        </div>
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
