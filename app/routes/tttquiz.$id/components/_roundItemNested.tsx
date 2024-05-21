import { UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Edit,
  GripVertical,
  ListPlus,
  MoreHorizontal,
  Send,
  Trash,
  UserSquare,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";
import {
  Accordion,
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
import { CreateQuestion, QuestionCreate } from "./_createQuestion";
import { QuestionItemNested } from "./_questionItemNested";

export const RoundItemNested: React.FC<{
  round: Round;
  questions: Question[];
  index: number;
  roundEditMode: boolean;
  questionEditMode: boolean;
  onDeleteRound: (rid: UniqueIdentifier) => void;
  onCreateQuestion: (q: QuestionCreate, rid: UniqueIdentifier) => void;
  onDeleteQuestion: (qid: UniqueIdentifier, rid: UniqueIdentifier) => void;
}> = ({
  round,
  questions,
  index,
  roundEditMode,
  questionEditMode,
  onDeleteRound,
  onCreateQuestion,
  onDeleteQuestion,
}) => {
  const canEditRound = useMemo(
    () => roundEditMode && !questionEditMode,
    [roundEditMode, questionEditMode],
  );
  const questionIds = useMemo(() => questions.map((q) => q.id), [questions]);
  const totalPoints = useMemo(() => {
    return questions.reduce((acc, q) => acc + q.points, 0);
  }, [questions]);

  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: round.id,
    disabled: !canEditRound,
    data: {
      type: "ROUND",
      round: round,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <AccordionItem
      value={round.id.toString()}
      ref={setNodeRef}
      style={style}
      className={`relative flex flex-col rounded-md bg-zinc-50 dark:bg-zinc-800 ${
        isDragging && "opacity-40"
      }`}
    >
      <AccordionTrigger
        disabled={canEditRound}
        className="h-20 items-center gap-2 rounded-t-md p-2"
      >
        <div
          className={`flex w-full flex-col items-start justify-start ${canEditRound && "pr-20"}`}
        >
          <h4 className="flex gap-4 text-sm font-bold text-orange-500 dark:text-orange-600">
            Round {index + 1}
          </h4>
          <h2 className="text-lg">{round.title}</h2>
          <h4 className="flex gap-4 text-sm text-zinc-400 dark:text-zinc-300">
            {questions.length} Questions {totalPoints} Points
          </h4>
        </div>
      </AccordionTrigger>
      {canEditRound && (
        <div className="absolute right-3 top-5 flex w-fit items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteRound(round.id)}
          >
            <XCircle className="text-red-500 dark:text-red-700" />
          </Button>
          <GripVertical {...attributes} {...listeners} />
        </div>
      )}
      <AccordionContent>
        {!questions.length && (
          <div className="flex h-16 items-center justify-center">
            This Round does not contain any Questions
          </div>
        )}
        <SortableContext
          items={questionIds}
          strategy={verticalListSortingStrategy}
        >
          <Accordion type="multiple" className="flex flex-col">
            {questions.map((question, i) => (
              <QuestionItemNested
                key={question.id}
                question={question}
                questionEditMode={questionEditMode}
                onDeleteQuestion={onDeleteQuestion}
                index={i}
              />
            ))}
          </Accordion>
        </SortableContext>
        <div className="flex justify-end gap-2 p-2">
          <CreateQuestion
            onCreateQuestion={(q) => onCreateQuestion(q, round.id)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Round Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ListPlus />
                Add to Quiz
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit />
                Edit Round
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send />
                Publish Round
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash />
                Delete Round
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserSquare />
                View Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export const RoundDragOverlay: React.FC<{ round: Round }> = ({ round }) => {
  return (
    <div
      className={`flex h-20 w-full items-center rounded-md bg-white p-2 dark:bg-zinc-500`}
    >
      <div className="flex h-full w-full flex-col items-start justify-start">
        <h4 className="flex gap-4 text-sm text-orange-500 dark:text-orange-600">
          Round
        </h4>
        <h2 className="text-lg">{round.title}</h2>
      </div>
      <GripVertical />
    </div>
  );
};
