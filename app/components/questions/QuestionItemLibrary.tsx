import { Link } from "@remix-run/react";
import {
  IconEyeCheck,
  IconList,
  IconMenu2,
  IconPencil,
  IconPlaylistAdd,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui";

type QuestionItemLibraryProps = {
  id: number;
  title: string;
  answer: string;
  category: string;
  points: number;
  noOfRounds: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  editPath: string;
  publishPath: string;
  deletePath: string;
  addToPath: string;
  viewRoundsPath: string;
};
export const QuestionItemLibrary: React.FC<QuestionItemLibraryProps> = ({
  id,
  title,
  answer,
  category,
  points,
  noOfRounds,
  published,
  createdAt,
  updatedAt,
  editPath,
  publishPath,
  deletePath,
  addToPath,
  viewRoundsPath,
}) => {
  return (
    <AccordionItem
      key={id}
      value={String(id)}
      className="flex w-full items-center gap-2 border-b px-2 hover:bg-zinc-100 dark:border-b-zinc-900 dark:hover:bg-zinc-900"
    >
      <AccordionTrigger hideIcon className="flex flex-col items-start py-2">
        <h4>{title}</h4>
        <AccordionContent>
          <h4>{answer}</h4>
        </AccordionContent>
        <h4 className="flex gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          {points} Points - {category}
        </h4>
        <AccordionContent className="flex gap-4 pt-0.5 text-xs text-zinc-400">
          <p>Used in {noOfRounds} Rounds</p>
          {createdAt && !updatedAt && (
            <time>{format(createdAt, "dd/MM/yyyy")}</time>
          )}
          {updatedAt && <time>{format(updatedAt, "dd/MM/yyyy")}</time>}
        </AccordionContent>
      </AccordionTrigger>
      {published && <IconEyeCheck className="size-6 text-zinc-600" />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="rounded-full">
            <IconMenu2 />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Rounds</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to={addToPath} className="flex gap-2">
              <IconPlaylistAdd className="size-6" />
              Add To Round
            </Link>
          </DropdownMenuItem>
          {noOfRounds > 0 && (
            <DropdownMenuItem asChild>
              <Link to={viewRoundsPath} className="flex gap-2">
                <IconList className="size-6" />
                View {noOfRounds} Rounds
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {!published && (
            <DropdownMenuItem asChild>
              <Link to={editPath} className="flex gap-2">
                <IconPencil className="size-6" />
                Edit Question
              </Link>
            </DropdownMenuItem>
          )}
          {!published && (
            <DropdownMenuItem asChild>
              <Link to={publishPath} className="flex gap-2">
                <IconUpload className="size-6" />
                Publish Question
              </Link>
            </DropdownMenuItem>
          )}
          {!published && (
            <DropdownMenuItem asChild>
              <Link to={deletePath} className="flex gap-2">
                <IconTrash className="size-6" />
                Delete Question
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </AccordionItem>
  );
};
