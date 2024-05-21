import { db } from "../db";
import { formatQuizzesApiResponse } from "./utils";

// /round/rid/quizzes-add-to
export const dbQuizGetForRound = async ({
  uid,
  rid,
  query = "",
}: {
  uid: number;
  rid: number;
  query: string;
}) => {
  const quizzes = await db.query.Quiz.findMany({
    with: {
      quizRounds: {
        with: {
          round: {
            with: {
              roundQuestions: {
                with: {
                  question: true,
                },
              },
            },
          },
        },
      },
    },
    where: (quizzes, { and, eq, ne, ilike }) => {
      return and(
        eq(quizzes.uid, uid),
        ne(quizzes.published, true),
        ilike(quizzes.title, `%${query}%`),
      );
    },
  });

  // how do I do this as part of the request?
  const filteredQuizzes = quizzes.filter((quiz) => {
    return quiz.quizRounds.every((qr) => qr.rid !== rid);
  });

  return formatQuizzesApiResponse(filteredQuizzes);
};
