import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useRouteLoaderData,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { isAuthenticated } from "~/api/auth";
import { dbQuestionGetForRound } from "~/api/question";
import { dbRoundAddQuestion, dbRoundRemoveQuestion } from "~/api/round";
import { NoContentContainer } from "~/components/NoContentContainer";
import {
  PageSection,
  PageSectionList,
  useIsPending,
} from "~/components/layout";
import {
  QuestionItemRound,
  QuestionItemRoundLibrary,
} from "~/components/questions";
import { Accordion, Button, H2, Input } from "~/components/ui";
import { RoundLoaderType } from "./round.$rid";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const rid = Number(params.rid);
  if (!rid) {
    return redirect("/library/rounds");
  }
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }

  const query = new URL(request.url).searchParams.get("q") ?? "";

  const questions = await dbQuestionGetForRound({ uid, rid, query });

  return json({
    questions,
    q: query,
  });
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // Add Question to Round
  const uid = await isAuthenticated(request);
  if (!uid) {
    return;
  }
  const rid = Number(params.rid);
  if (!rid) {
    return redirect("/library/rounds");
  }
  const formData = await request.formData();
  const selectedQuestion = formData.get("selectedQuestion");
  const removeQuestion = formData.get("removeQuestion");

  if (Boolean(selectedQuestion)) {
    console.log(selectedQuestion);
    await dbRoundAddQuestion({
      uid,
      rid,
      qid: Number(selectedQuestion),
    });
  }
  if (Boolean(removeQuestion)) {
    await dbRoundRemoveQuestion({
      uid,
      rid,
      qid: Number(removeQuestion),
    });
  }
  return true;
};

const RoundQuestions = () => {
  const parentRes = useRouteLoaderData<RoundLoaderType>("routes/round.$rid");
  const loaderRes = useLoaderData<typeof loader>();

  const round = parentRes?.round;
  const { questions, q } = loaderRes;

  const [query, setQuery] = useState(q || "");

  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  const submit = useSubmit();

  const { isPending } = useIsPending();

  if (!round) {
    return null;
  }

  const hasQuestions = round.noOfQuestions > 0;
  const hasLibraryQuestions = (Boolean(questions.length) && !q) || q;

  return (
    <PageSectionList className="flex-col 2xl:flex-row">
      <PageSection>
        {hasQuestions && (
          <Accordion type="multiple" className="border-t dark:border-zinc-900">
            {round.questions.map((q, i) => (
              <QuestionItemRound
                key={q.id}
                i={i + 1}
                qid={q.id}
                title={q.title}
                answer={q.answer}
                category={q.category}
                points={q.points}
                createdAt={q.createdAt}
                updatedAt={q.updatedAt}
                noOfRounds={q.noOfRounds}
                editPath={`/round/${round.id}/questions/${q.id}/edit`}
                publishPath={`/round/${round.id}/questions/${q.id}/publish`}
                deletePath={`/round/${round.id}/questions/${q.id}/delete`}
                addToPath={`/round/${round.id}/questions/${q.id}/add-to`}
                viewRoundsPath={`/round/${round.id}/questions/${q.id}/view-rounds`}
              />
            ))}
          </Accordion>
        )}

        {!hasQuestions && (
          <NoContentContainer className="h-20">
            <p>
              Click <i>Create New Question</i> to get started, or search from
              your Library
            </p>
          </NoContentContainer>
        )}

        {!round.published && (
          <Button asChild className="w-full lg:ml-auto lg:w-fit">
            <Link to={`/round/${round.id}/questions-create`}>
              Create New Question
            </Link>
          </Button>
        )}
      </PageSection>

      {!round.published && (
        <PageSection>
          <header className="flex h-20 flex-col justify-between gap-2">
            <H2 className="text-xl">Add Questions From Library</H2>
            <Form
              id="search-form"
              onChange={(event) => submit(event.currentTarget)}
              role="search"
            >
              <Input
                aria-label="Search Questions"
                defaultValue={q || ""}
                disabled={!hasLibraryQuestions}
                id="q"
                name="q"
                placeholder="Search your Library..."
                type="search"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
              />
            </Form>
          </header>

          {!hasLibraryQuestions && (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
              {Boolean(round.noOfQuestions) && (
                <p>This Round already contains all your available Questions.</p>
              )}
              {!Boolean(round.noOfQuestions) && (
                <p>You have no available Questions for this Round.</p>
              )}
              <p>
                Click <i>Create Question</i> to add something new.
              </p>
            </div>
          )}

          {hasLibraryQuestions && (
            <Form method="post">
              <Accordion type="multiple">
                {questions.map((q) => (
                  <QuestionItemRoundLibrary
                    key={q.qid}
                    qid={q.qid}
                    title={q.title}
                    answer={q.answer}
                    category={q.category}
                    points={q.points}
                    createdAt={q.createdAt}
                    updatedAt={q.updatedAt}
                    noOfRounds={q.noOfRounds}
                    name="selectedQuestion"
                    value={q.qid}
                    type="submit"
                    disabled={isPending}
                  />
                ))}
              </Accordion>
            </Form>
          )}
        </PageSection>
      )}

      <Outlet />
    </PageSectionList>
  );
};

export default RoundQuestions;
