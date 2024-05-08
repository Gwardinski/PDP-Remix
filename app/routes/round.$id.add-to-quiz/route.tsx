import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
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
import { NoContentContainer } from "~/components/NoContentContainer";
import { PageTabContent } from "~/components/layout";
import { QuizGrid, QuizItemRoundAdd } from "~/components/quizzes";
import { Button, Input } from "~/components/ui";
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

  return json({ quizzes, z, hasNoQuizzes });
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

  return true;
};

const RoundPageQuizzesAddTo = () => {
  const loaderRes = useLoaderData<typeof loader>();
  const { quizzes, z, hasNoQuizzes } = loaderRes;

  // Search
  const [query, setQuery] = useState(z || "");

  useEffect(() => {
    setQuery(z || "");
  }, [z]);

  const submit = useSubmit();

  const { state } = useNavigation();
  const isPending = Boolean(state === "submitting" || state === "loading");

  return (
    <PageTabContent>
      {hasNoQuizzes && (
        <NoContentContainer className="gap-4">
          <p>You have no available Quizzes to add this Round to.</p>
          <Button>Add to New Quiz</Button>
        </NoContentContainer>
      )}

      {Boolean(quizzes.length) && (
        <>
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

          <Form method="post">
            <QuizGrid>
              {quizzes.map((quiz) => {
                return (
                  <QuizItemRoundAdd
                    key={quiz.id}
                    name="selectedQuiz"
                    value={quiz.id}
                    type="submit"
                    disabled={isPending}
                    title={quiz.title}
                    description={quiz.description}
                    createdAt={quiz.createdAt}
                    updatedAt={quiz.updatedAt}
                  />
                );
              })}
            </QuizGrid>
          </Form>
        </>
      )}
    </PageTabContent>
  );
};

export default RoundPageQuizzesAddTo;
