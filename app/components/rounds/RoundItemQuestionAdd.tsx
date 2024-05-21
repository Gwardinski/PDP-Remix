import { ButtonHTMLAttributes } from "react";
import { H4 } from "../ui";

interface RoundItemQuestionAddProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  noOfQuestions: number;
  noOfQuizzes: number;
}
export const RoundItemQuestionAdd: React.FC<RoundItemQuestionAddProps> = ({
  title,
  noOfQuestions,
  noOfQuizzes,
  ...rest
}) => {
  return (
    <button
      className="flex h-20 w-full flex-col justify-center rounded-xl border px-4 hover:bg-zinc-100 active:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-900 dark:active:bg-zinc-800"
      {...rest}
    >
      <H4>{title}</H4>
      <p className="text-sm">{noOfQuestions} Questions</p>
      <p className="text-sm">Used by {noOfQuizzes} Quizzes</p>
    </button>
  );
};
