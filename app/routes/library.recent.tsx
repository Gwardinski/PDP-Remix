import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, MetaFunction, Outlet, useLoaderData } from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import { dbQuestionsGetRecent } from "~/api/question";
import { dbQuizzesGetRecent } from "~/api/quiz";
import { dbRoundsGetRecent } from "~/api/round";
import {
  PageSection,
  PageSectionHeader,
  PageSectionList,
} from "~/components/layout";
import { QuestionItemLibrary } from "~/components/questions";
import { QuizGrid, QuizItemLibrary } from "~/components/quizzes";
import { RoundGrid, RoundItemLibrary } from "~/components/rounds";
import { Accordion, Button, H2 } from "~/components/ui";

export const meta: MetaFunction = () => {
  return [
    { title: "Your Library" },
    {
      name: "Your Library",
      content: "Your recent activity",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }

  const quizzes = await dbQuizzesGetRecent(uid);
  const rounds = await dbRoundsGetRecent(uid);
  const questions = await dbQuestionsGetRecent(uid);
  // const quizzesIncomplete = await dbQuizzesGetIncomplete(uid);
  // const roundsIncomplete = await dbRoundsGetIncomplete(uid);

  return json({
    quizzes,
    rounds,
    questions,
  });
}

const LibraryRecentPage = () => {
  const { quizzes, rounds, questions } = useLoaderData<typeof loader>();

  return (
    <PageSectionList>
      {quizzes?.length > 0 && (
        <PageSection>
          <PageSectionHeader>
            <H2>Recent Quizzes</H2>
            <Button variant="outline" asChild>
              <Link to="/library/quizzes">View All</Link>
            </Button>
          </PageSectionHeader>
          <QuizGrid>
            {quizzes.map((z) => (
              <QuizItemLibrary
                key={z.id}
                id={z.id}
                title={z.title}
                description={z.description}
                noOfRounds={z.noOfRounds}
                noOfQuestions={z.noOfQuestions}
                totalPoints={z.totalPoints}
                createdAt={z.createdAt}
                updatedAt={z.updatedAt}
                published={z.published}
              />
            ))}
          </QuizGrid>
        </PageSection>
      )}

      {rounds?.length > 0 && (
        <PageSection>
          <PageSectionHeader>
            <H2>Recent Rounds</H2>
            <Button variant="outline" asChild>
              <Link to="/library/rounds">View All</Link>
            </Button>
          </PageSectionHeader>
          <RoundGrid>
            {rounds.map((r) => (
              <RoundItemLibrary
                key={r.id}
                id={r.id}
                title={r.title}
                description={r.description}
                createdAt={r.createdAt}
                updatedAt={r.updatedAt}
                noOfQuestions={0}
                noOfQuizzes={0}
                published={r.published}
                isPending={false}
              />
            ))}
          </RoundGrid>
        </PageSection>
      )}

      {questions?.length > 0 && (
        <PageSection>
          <PageSectionHeader>
            <H2>Recent Questions</H2>
            <Button variant="outline" asChild>
              <Link to="/library/questions">View All</Link>
            </Button>
          </PageSectionHeader>
          <Accordion type="multiple">
            {questions.map((q) => (
              <QuestionItemLibrary
                key={q.id}
                id={q.id}
                title={q.title}
                answer={q.answer}
                category={q.category}
                points={q.points}
                noOfRounds={q.roundQuestions.length}
                published={q.published}
                createdAt={q.createdAt}
                updatedAt={q.updatedAt}
                editPath={`/library/recent/questions/${q.id}/edit`}
                publishPath={`/library/recent/questions/${q.id}/publish`}
                deletePath={`/library/recent/questions/${q.id}/delete`}
                addToPath={`/library/recent/questions/${q.id}/add-to`}
                viewRoundsPath={`/library/recent/questions/${q.id}/view-rounds`}
              />
            ))}
          </Accordion>
        </PageSection>
      )}

      <Outlet />
    </PageSectionList>
  );
};

export default LibraryRecentPage;
