import { ButtonHTMLAttributes } from "react";
import { H4 } from "../ui";

interface QuizAddRoundItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  noOfRounds: number;
}
export const QuizAddRoundItem: React.FC<QuizAddRoundItemProps> = ({
  title,
  noOfRounds,

  ...rest
}) => {
  return (
    <button
      className="flex h-16 w-full flex-col rounded-xl border border-zinc-700 px-4 py-2 hover:bg-zinc-900 active:bg-zinc-800"
      {...rest}
    >
      <H4 className="font-bold">{title}</H4>
      <div className="flex gap-4 text-sm">
        <p>{noOfRounds} Rounds</p>
      </div>
    </button>
  );
};
