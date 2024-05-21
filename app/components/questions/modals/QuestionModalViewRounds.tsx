import { Form, useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { RoundItemQuestion } from "~/components/rounds";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "~/components/ui";

type QuestionModalViewRoundsProps = {
  r: string;
  basePath: string;
  rounds: {
    id: number;
    uid: number;
    title: string;
    noOfQuestions: number;
    noOfQuizzes: number;
  }[];
};
export const QuestionModalViewRounds: React.FC<
  QuestionModalViewRoundsProps
> = ({ r, basePath, rounds }) => {
  const [query, setQuery] = useState(r || "");

  useEffect(() => {
    setQuery(r || "");
  }, [r]);

  const submit = useSubmit();

  const navigate = useNavigate();
  const closeModal = () => navigate(basePath, { replace: true });

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Rounds</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col justify-between gap-4">
          <Form
            className="flex flex-col gap-2"
            id="search-form"
            onChange={(event) => submit(event.currentTarget)}
            role="search"
          >
            <Input
              aria-label="Search Rounds"
              defaultValue={r || ""}
              id="r"
              name="r"
              placeholder="Search your Rounds"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
            />
          </Form>
        </div>

        <div className="flex flex-col gap-2">
          {rounds.map(({ id, title, noOfQuestions, noOfQuizzes }) => (
            <RoundItemQuestion
              key={id}
              rid={id}
              title={title}
              noOfQuestions={noOfQuestions}
              noOfQuizzes={noOfQuizzes}
            />
          ))}
        </div>

        <DialogFooter className="pt-8">
          <Button
            variant="outline"
            type="button"
            onClick={closeModal}
            className="w-full"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
