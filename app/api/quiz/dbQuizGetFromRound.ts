import { db } from "../db";
import { formatQuizzesApiResponse } from "./utils";

export const dbQuizGetFromRound = async (rid: number) => {
  const quizRounds = await db.query.quizToRound.findMany({
    with: {
      quiz: {
        with: {
          quizRounds: {
            columns: {},
            with: {
              round: {
                with: {
                  roundQuestions: {
                    columns: {},
                    with: {
                      question: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    where: (quizToRound, { eq }) => {
      return eq(quizToRound.rid, rid);
    },
  });

  const quizzes = quizRounds.map((quizRound) => {
    return quizRound.quiz;
  });

  return formatQuizzesApiResponse(quizzes);
};
