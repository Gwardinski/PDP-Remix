import { Link } from "@remix-run/react";
import { ButtonHTMLAttributes } from "react";
import { H4 } from "../ui";

interface RoundItemQuestionProps
  extends ButtonHTMLAttributes<HTMLAnchorElement> {
  rid: number;
  title: string;
  noOfQuestions: number;
  noOfQuizzes: number;
}
export const RoundItemQuestion: React.FC<RoundItemQuestionProps> = ({
  rid,
  title,
  noOfQuestions,
  noOfQuizzes,
}) => {
  return (
    <Link
      to={`/round/${rid}`}
      className="flex h-20 w-full flex-col justify-center rounded-xl border px-4 hover:bg-zinc-100 active:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-900 dark:active:bg-zinc-800"
    >
      <H4>{title}</H4>
      <p className="text-sm">{noOfQuestions} Questions</p>
      <p className="text-sm">Used by {noOfQuizzes} Quizzes</p>
    </Link>
  );
};
