import { ButtonHTMLAttributes } from "react";
import { H4 } from "../ui";

interface QuizItemRoundAddModalProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  noOfRounds: number;
}
export const QuizItemRoundAdd: React.FC<QuizItemRoundAddModalProps> = ({
  title,
  noOfRounds,

  ...rest
}) => {
  return (
    <button
      className="flex h-16 w-full flex-col justify-center rounded-xl border px-4 hover:bg-zinc-100 active:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-900"
      {...rest}
    >
      <H4>{title}</H4>
      <p className="text-sm">{noOfRounds} Rounds</p>
    </button>
  );
};
