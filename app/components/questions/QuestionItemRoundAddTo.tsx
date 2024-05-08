import { IconPlaylistAdd } from "@tabler/icons-react";
import { format } from "date-fns";
import { ButtonHTMLAttributes } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "../ui";

interface QuestionItemRoundAddToProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  qid: number;
  title: string;
  answer: string;
  category: string;
  points: number;
  createdAt: string;
  updatedAt: string;
  onAddQuestion: () => void;
}
export const QuestionItemRoundAddTo: React.FC<QuestionItemRoundAddToProps> = ({
  qid,
  title,
  answer,
  category,
  points,
  createdAt,
  updatedAt,
  onAddQuestion,
  ...rest
}) => {
  return (
    <AccordionItem
      value={String(qid)}
      className="flex w-full items-center gap-2 border-b border-b-zinc-900"
    >
      <AccordionTrigger hideIcon className="flex flex-col items-start py-2">
        <h4>{title}</h4>
        <AccordionContent>
          <h4>{answer}</h4>
        </AccordionContent>
        <h4 className="flex gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          {points} Points - {category}
        </h4>
        <AccordionContent className="flex gap-4 pt-0.5">
          {createdAt && !updatedAt && (
            <time className="text-xs text-zinc-400">
              {format(createdAt, "dd/MM/yyyy")}
            </time>
          )}
          {updatedAt && (
            <time className="text-xs text-zinc-400">
              {format(updatedAt, "dd/MM/yyyy")}
            </time>
          )}
        </AccordionContent>
      </AccordionTrigger>
      <Button variant="ghost" size="icon" onClick={onAddQuestion} {...rest}>
        <IconPlaylistAdd />
      </Button>
    </AccordionItem>
  );
};
