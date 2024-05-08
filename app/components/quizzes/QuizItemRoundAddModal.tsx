import { ButtonHTMLAttributes } from "react";
import { H4 } from "../ui";

interface QuizItemRoundAddModalProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  noOfRounds: number;
  noOfQuestions: number;
}
export const QuizItemRoundAddModal: React.FC<QuizItemRoundAddModalProps> = ({
  title,
  noOfRounds,
  noOfQuestions,
  ...rest
}) => {
  return (
    <button
      className="flex w-full flex-col gap-2 rounded-xl border border-zinc-700 p-4 hover:bg-zinc-900 active:bg-zinc-800"
      {...rest}
    >
      <H4 className="font-bold">{title}</H4>
      <p>
        {noOfRounds} Rounds - {noOfQuestions} Questions
      </p>
    </button>
  );
};
