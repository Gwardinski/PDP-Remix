import { format } from "date-fns";
import { ButtonHTMLAttributes } from "react";
import { H4 } from "../ui";

interface QuizItemAddRoundProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}
export const QuizItemRoundAdd: React.FC<QuizItemAddRoundProps> = ({
  title,
  description,
  createdAt,
  updatedAt,
  ...rest
}) => {
  return (
    <button
      className="flex w-full flex-col gap-2 rounded-xl border border-zinc-700 px-4 pb-6 pt-5 hover:bg-zinc-900 active:bg-zinc-800"
      {...rest}
    >
      <div className="flex w-full justify-between gap-2 text-xs text-zinc-300">
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
      <H4 className="font-bold">{title}</H4>
      <h6 className="h-5 overflow-hidden text-zinc-300">{description}</h6>
    </button>
  );
};
