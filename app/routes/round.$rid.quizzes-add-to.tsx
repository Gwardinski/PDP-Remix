import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import { dbQuizAddRound, dbQuizGetForRound } from "~/api/quiz";
import { NoContentContainer } from "~/components/NoContentContainer";
import { PageTabContent, useIsPending } from "~/components/layout";
import { QuizCardRoundLibrary, QuizGrid } from "~/components/quizzes";
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

  const quizzes = await dbQuizGetForRound({ rid, uid, query: "" });
  const noQuizzes = !quizzes.length; // and no searching

  return json({
    quizzes,
    noQuizzes,
  });
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // Add Round to Quiz
  const uid = await isAuthenticated(request);
  if (!uid) {
    return;
  }
  const rid = Number(params.rid);
  if (!rid) {
    return redirect("/library/rounds");
  }

  const formData = await request.formData();
  const selectedQuiz = formData.get("selectedQuiz");

  await dbQuizAddRound({
    uid,
    rid,
    zid: Number(selectedQuiz),
  });

  return true;
};

const RoundQuizzesAddTo = () => {
  const parentRes = useRouteLoaderData<RoundLoaderType>("routes/round.$rid");
  const loaderRes = useLoaderData<typeof loader>();

  const { isPending } = useIsPending();

  const round = parentRes?.round;
  const { quizzes, noQuizzes } = loaderRes;

  if (!round) {
    return null;
  }

  return (
    <PageTabContent>
      {noQuizzes && (
        <NoContentContainer>
          <p>You have no available Quizzes to add this Round to</p>
        </NoContentContainer>
      )}
      {Boolean(quizzes.length) && (
        <Form method="post">
          <QuizGrid>
            {quizzes.map((z) => (
              <QuizCardRoundLibrary
                key={z.zid}
                zid={z.zid}
                title={z.title}
                description={z.description}
                createdAt={z.createdAt}
                updatedAt={z.updatedAt}
                published={z.published}
                noOfRounds={z.noOfRounds}
                noOfQuestions={z.noOfQuestions}
                totalPoints={z.totalPoints}
                name="selectedQuiz"
                value={z.zid}
                type="submit"
                disabled={isPending}
              />
            ))}
          </QuizGrid>
        </Form>
      )}
    </PageTabContent>
  );
};

export default RoundQuizzesAddTo;
