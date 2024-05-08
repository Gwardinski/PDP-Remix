import { UniqueIdentifier } from "@dnd-kit/core";
import { ListPlus } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui";
import { Question, Round } from "../_state";

export const QuestionItem: React.FC<{
  question: Question;
  rounds?: Round[];
  onAddToRound?: (question: Question, rid: UniqueIdentifier) => void;
}> = ({ question, rounds, onAddToRound }) => {
  return (
    <AccordionItem
      value={question.id.toString()}
      className="flex flex-col rounded-md bg-zinc-50 dark:bg-zinc-800"
    >
      <AccordionTrigger
        hideIcon
        className="flex min-h-[80px] items-center gap-2 rounded-md p-2"
      >
        <div className="flex w-full flex-col items-start justify-start">
          <h4>{question.title}</h4>
          <AccordionContent>
            <h4 className="italic">{question.answer}</h4>
          </AccordionContent>
          <h4 className="flex gap-4 text-sm text-zinc-400 dark:text-zinc-300">
            {question.points} Points
          </h4>
        </div>
        <div className="ml-auto flex w-fit items-center justify-center gap-2">
          {onAddToRound && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ListPlus />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Add To Round</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {rounds?.map((round) => {
                  return (
                    <DropdownMenuItem
                      key={round.id}
                      onClick={() => onAddToRound(question, round.id)}
                    >
                      {round.title}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </AccordionTrigger>
    </AccordionItem>
  );
};
