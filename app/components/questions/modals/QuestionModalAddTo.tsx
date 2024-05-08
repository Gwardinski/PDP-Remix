import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useNavigate, useNavigation, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { RoundAddQuestionItem } from "~/components/rounds";
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

const formSchema = z.object({
  rid: z.number(),
  qid: z.number(),
});
const resolver = zodResolver(formSchema);
type QuestionAddToFormType = z.infer<typeof formSchema>;

type QuestionModalAddToProps = {
  r: string;
  qid: number;
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
  qid,
  noRounds,
  errorMessage,
  basePath,
  rounds,
}) => {
  const form = useRemixForm<QuestionAddToFormType>({
    resolver,
    defaultValues: {
      qid: qid,
    },
  });

  const [query, setQuery] = useState(r || "");

  useEffect(() => {
    setQuery(r || "");
  }, [r]);

  const submit = useSubmit();

  const navigate = useNavigate();
  const closeModal = () => navigate(basePath, { replace: true });

  const { state } = useNavigation();
  const isPending = Boolean(state === "submitting" || state === "loading");

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

            <Form method="post" onSubmit={form.handleSubmit}>
              <RemixFormProvider {...form}>
                <div className="flex flex-col gap-2">
                  {errorMessage && <FormMessage>{errorMessage}</FormMessage>}

                  {rounds.map(({ id, title, noOfQuestions, noOfQuizzes }) => (
                    <RoundAddQuestionItem
                      key={id}
                      onClick={() => form.setValue("rid", id)}
                      type="submit"
                      disabled={isPending}
                      title={title}
                      noOfQuestions={noOfQuestions}
                      noOfQuizzes={noOfQuizzes}
                    />
                  ))}
                </div>
              </RemixFormProvider>
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
