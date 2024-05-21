import { Form, useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useIsPending } from "~/components/layout";
import { RoundItemQuestionAdd } from "~/components/rounds";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormMessage,
  Input,
} from "~/components/ui";

type QuestionModalAddToProps = {
  r: string;
  title: string;
  noRounds: boolean;
  errorMessage: string;
  basePath: string;
  rounds: {
    id: number;
    uid: number;
    title: string;
    noOfQuestions: number;
    noOfQuizzes: number;
  }[];
};
export const QuestionModalAddTo: React.FC<QuestionModalAddToProps> = ({
  r,
  noRounds,
  errorMessage,
  basePath,
  rounds,
}) => {
  const [query, setQuery] = useState(r || "");

  useEffect(() => {
    setQuery(r || "");
  }, [r]);

  const submit = useSubmit();

  const navigate = useNavigate();
  const closeModal = () => navigate(basePath, { replace: true });

  const { isPending } = useIsPending();

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Question to Round</DialogTitle>
        </DialogHeader>

        {noRounds && (
          <p>This Question is already part of all available Rounds.</p>
        )}

        {!noRounds && (
          <>
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

            <Form method="post">
              <div className="flex flex-col gap-2">
                {errorMessage && <FormMessage>{errorMessage}</FormMessage>}

                {rounds.map(({ id, title, noOfQuestions, noOfQuizzes }) => (
                  <RoundItemQuestionAdd
                    key={id}
                    name="selectedRound"
                    value={id}
                    type="submit"
                    disabled={isPending}
                    title={title}
                    noOfQuestions={noOfQuestions}
                    noOfQuizzes={noOfQuizzes}
                  />
                ))}
              </div>
            </Form>
          </>
        )}

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
