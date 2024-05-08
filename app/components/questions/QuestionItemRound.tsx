import { Link } from "@remix-run/react";
import {
  IconGripVertical,
  IconMenu2,
  IconPencil,
  IconPlaylistAdd,
  IconPlaylistX,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { format } from "date-fns";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui";

type QuestionItemRoundProps = {
  i: number;
  id: number;
  title: string;
  answer: string;
  category: string;
  points: number;
  createdAt: string;
  updatedAt: string;
};
export const QuestionItemRound: React.FC<QuestionItemRoundProps> = ({
  i,
  id,
  title,
  answer,
  category,
  points,
  createdAt,
  updatedAt,
}) => {
  return (
    <AccordionItem
      key={id}
      value={String(id)}
      className="flex w-full items-center gap-2 border-b border-b-zinc-900"
    >
      <AccordionTrigger hideIcon className="flex flex-col items-start py-2">
        <h6 className="text-sm text-orange-500 dark:text-orange-600">
          Question {i}
        </h6>
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
      <div className="flex">
        <Button size="icon" variant="ghost">
          <IconGripVertical />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="rounded-full">
              <IconMenu2 />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="flex gap-2">
              <IconPlaylistX className="size-6" />
              Remove Question
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to={`/library/questions/${id}/add-to`}
                className="flex gap-2"
              >
                <IconPlaylistAdd className="size-6" />
                Add To Another Round
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/library/questions/${id}/edit`} className="flex gap-2">
                <IconPencil className="size-6" />
                Edit Question
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to={`/library/questions/${id}/publish`}
                className="flex gap-2"
              >
                <IconUpload className="size-6" />
                Publish Question
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to={`/library/questions/${id}/delete`}
                className="flex gap-2"
              >
                <IconTrash className="size-6" />
                Delete Question
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </AccordionItem>
  );
};
