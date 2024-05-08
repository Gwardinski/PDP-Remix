import { ButtonHTMLAttributes } from "react";
import { H4 } from "../ui";

interface RoundAddQuestionItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  noOfQuestions: number;
  noOfQuizzes: number;
}
export const RoundAddQuestionItem: React.FC<RoundAddQuestionItemProps> = ({
  title,
  noOfQuestions,
  noOfQuizzes,
  ...rest
}) => {
  return (
    <button
      className="flex h-16 w-full flex-col rounded-xl border border-zinc-700 px-4 py-2 hover:bg-zinc-900 active:bg-zinc-800"
      {...rest}
    >
      <H4 className="font-bold">{title}</H4>
      <div className="flex gap-4 text-sm">
        <p>{noOfQuestions} Questions</p>
        <p>Used by {noOfQuizzes} Quizzes</p>
      </div>
    </button>
  );
};
