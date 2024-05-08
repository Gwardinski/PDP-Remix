import { Link } from "@remix-run/react";
import { ButtonHTMLAttributes } from "react";
import { H4 } from "../ui";

interface RoundQuestionViewItemProps
  extends ButtonHTMLAttributes<HTMLAnchorElement> {
  rid: number;
  title: string;
  noOfQuestions: number;
  noOfQuizzes: number;
}
export const RoundQuestionViewItem: React.FC<RoundQuestionViewItemProps> = ({
  rid,
  title,
  noOfQuestions,
  noOfQuizzes,
}) => {
  return (
    <Link
      to={`/round/${rid}`}
      className="flex h-16 w-full flex-col rounded-xl border border-zinc-700 px-4 py-2 hover:bg-zinc-900 active:bg-zinc-800"
    >
      <H4 className="font-bold">{title}</H4>
      <div className="flex gap-4 text-sm">
        <p>{noOfQuestions} Questions</p>
        <p>Used by {noOfQuizzes} Quizzes</p>
      </div>
    </Link>
  );
};
