import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import { dbQuizGetFromRound } from "~/api/quiz";
import { NoContentContainer } from "~/components/NoContentContainer";
import { PageTabContent } from "~/components/layout";
import { QuizGrid, QuizItemLibrary } from "~/components/quizzes";
import { RoundLoaderType } from "../round.$id/route";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const rid = Number(params.id);
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

const RoundPageQuizzes = () => {
  const parentRes = useRouteLoaderData<RoundLoaderType>("routes/round.$id");
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
          {quizzes.map(({ quiz }) => (
            <QuizItemLibrary
              key={quiz.id}
              id={quiz.id}
              title={quiz.title}
              description={quiz.description}
              noOfRounds={quiz.noOfRounds}
              noOfQuestions={quiz.noOfQuestions}
              createdAt={quiz.createdAt}
              updatedAt={quiz.updatedAt}
              published={quiz.published}
            />
          ))}
        </QuizGrid>
      )}
    </PageTabContent>
  );
};

export default RoundPageQuizzes;
