import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import { dbQuizGetFromRound } from "~/api/quiz";
import { NoContentContainer } from "~/components/NoContentContainer";
import { PageTabContent } from "~/components/layout";
import { QuizCardLibrary, QuizGrid } from "~/components/quizzes";
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

  const quizzes = await dbQuizGetFromRound(rid);

  return json({
    quizzes,
  });
}

const RoundQuizzes = () => {
  const parentRes = useRouteLoaderData<RoundLoaderType>("routes/round.$rid");
  const loaderRes = useLoaderData<typeof loader>();

  const round = parentRes?.round;
  const { quizzes } = loaderRes;

  if (!round) {
    return null;
  }

  return (
    <PageTabContent>
      {round.noOfQuizzes === 0 && (
        <NoContentContainer>
          <p>This Round has not been added to any Quizzes yet.</p>
          <p>
            Click <i>Add to Quiz</i> above to view your library of Quizzes.
          </p>
        </NoContentContainer>
      )}
      {round.noOfQuizzes > 0 && (
        <QuizGrid>
          {quizzes.map((quiz) => (
            <QuizCardLibrary
              key={quiz.zid}
              zid={quiz.zid}
              title={quiz.title}
              description={quiz.description}
              createdAt={quiz.createdAt}
              updatedAt={quiz.updatedAt}
              published={quiz.published}
              noOfRounds={quiz.noOfRounds}
              noOfQuestions={quiz.noOfQuestions}
              totalPoints={quiz.totalPoints}
            />
          ))}
        </QuizGrid>
      )}
    </PageTabContent>
  );
};

export default RoundQuizzes;
