import { Form, useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useIsPending } from "~/components/layout";
import { QuizItemRoundAdd } from "~/components/quizzes";
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

type RoundModalAddToProps = {
  z: string;
  title: string;
  noQuizzes: boolean;
  errorMessage: string;
  basePath: string;
  quizzes: {
    id: number;
    uid: number;
    title: string;
    noOfRounds: number;
  }[];
};
export const RoundModalAddTo: React.FC<RoundModalAddToProps> = ({
  z,
  noQuizzes,
  errorMessage,
  basePath,
  quizzes,
}) => {
  const [query, setQuery] = useState(z || "");

  useEffect(() => {
    setQuery(z || "");
  }, [z]);

  const submit = useSubmit();

  const navigate = useNavigate();
  const closeModal = () => navigate(basePath, { replace: true });

  const { isPending } = useIsPending();

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Round to Quiz</DialogTitle>
        </DialogHeader>

        {noQuizzes && (
          <p>This Round is already part of all available Quizzes.</p>
        )}

        {!noQuizzes && (
          <>
            <div className="flex flex-col justify-between gap-4">
              <Form
                className="flex flex-col gap-2"
                id="search-form"
                onChange={(event) => submit(event.currentTarget)}
                role="search"
              >
                <Input
                  aria-label="Search Quizzes"
                  defaultValue={z || ""}
                  id="z"
                  name="z"
                  placeholder="Search your Quizzes"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                />
              </Form>
            </div>

            <Form method="post">
              <div className="flex flex-col gap-2">
                {errorMessage && <FormMessage>{errorMessage}</FormMessage>}

                {quizzes.map(({ id, title, noOfRounds }) => (
                  <QuizItemRoundAdd
                    key={id}
                    name="selectedQuiz"
                    value={id}
                    type="submit"
                    disabled={isPending}
                    title={title}
                    noOfRounds={noOfRounds}
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
