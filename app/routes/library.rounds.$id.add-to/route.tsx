import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { isAuthenticated } from "~/api/auth";
import {
  dbQuizAddChild,
  dbQuizAddChildGet,
  dbQuizAddChildGetChild,
} from "~/api/quiz";
import { QuizItemRoundAddModal } from "~/components/quizzes";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "~/components/ui";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const rid = Number(params.id);
  if (!rid) {
    return redirect("/library/rounds");
  }
  const round = await dbQuizAddChildGetChild({ uid, rid });
  if (!round || (round.uid !== uid && round.published !== true)) {
    return redirect("/library/rounds");
  }

  const currentZids = round.quizRounds.map((qr) => qr.zid);
  const z = new URL(request.url).searchParams.get("z") ?? "";
  const quizzes = await dbQuizAddChildGet({ uid, query: z, currentZids });

  const hasNoQuizzes = quizzes.length === 0 && !z;

  return json({ round, quizzes, z, hasNoQuizzes });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/library/rounds");
  }
  const rid = Number(params.id);
  if (!rid) {
    return redirect("/library/rounds");
  }

  // Add Round to Quiz
  const formData = await request.formData();
  const selectedQuiz = formData.get("selectedQuiz");
  await dbQuizAddChild({
    uid,
    rid,
    zid: Number(selectedQuiz),
  });

  // Close Modal
  return redirect("/library/rounds");
};

const RoundAddToPage = () => {
  const loaderRes = useLoaderData<typeof loader>();
  const { round, quizzes, z, hasNoQuizzes } = loaderRes;

  // Search
  const [query, setQuery] = useState(z || "");

  useEffect(() => {
    setQuery(z || "");
  }, [z]);

  const submit = useSubmit();

  const navigate = useNavigate();
  const closeModal = () =>
    z ? navigate("/library/rounds", { replace: true }) : navigate(-1);

  const { state } = useNavigation();
  const isPending = Boolean(state === "submitting" || state === "loading");

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Round to Quiz</DialogTitle>
        </DialogHeader>

        {hasNoQuizzes && (
          <p>This Round is already part of all available Quizzes.</p>
        )}

        {!hasNoQuizzes && (
          <>
            <div className="flex flex-col justify-between gap-4">
              <p>{round?.title}</p>

              <Form
                className="flex flex-col gap-2"
                id="search-form"
                onChange={(event) => submit(event.currentTarget)}
                role="search"
              >
                <Input
                  aria-label="Search Quizzes"
                  defaultValue={z || ""}
                  id="r"
                  name="r"
                  placeholder="Search your Quizzes"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                />
              </Form>
            </div>

            <Form method="post">
              <div className="flex flex-col gap-2">
                {quizzes.map((quiz) => (
                  <QuizItemRoundAddModal
                    key={quiz.id}
                    name="selectedQuiz"
                    value={quiz.id}
                    type="submit"
                    disabled={isPending}
                    title={quiz.title}
                    noOfRounds={quiz.noOfRounds}
                    noOfQuestions={quiz.noOfQuestions}
                  ></QuizItemRoundAddModal>
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

export default RoundAddToPage;
