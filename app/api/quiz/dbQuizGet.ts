import { eq } from "drizzle-orm";
import { db } from "../db";
import { Quiz } from "../schema";
import { formatQuizApiResponse, formatQuizzesApiResponse } from "./utils";

export const dbQuizGet = async ({ zid, uid }: { zid: number; uid: number }) => {
  const quiz = await db.query.Quiz.findFirst({
    where: (quiz, { and, or, eq }) =>
      and(eq(quiz.id, zid), or(eq(quiz.published, true), eq(quiz.uid, uid))),
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
  });

  if (!quiz) {
    return null;
  }

  return formatQuizApiResponse(quiz);
};

export const dbQuizGetLibrary = async (uid: number, q: string = "") => {
  const quizzes = await db.query.Quiz.findMany({
    where: (quizzes, { eq, ilike, and }) => {
      return and(eq(quizzes.uid, uid), ilike(quizzes.title, `%${q}%`));
    },
    with: {
      quizRounds: {
        columns: {},
        with: {
          round: {
            columns: {
              id: true,
            },
            with: {
              roundQuestions: {
                columns: {},
                with: {
                  question: {
                    columns: {
                      id: true,
                      points: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return formatQuizzesApiResponse(quizzes);
};

export const dbQuizzesGetRecent = async (uid: number) => {
  const quizzes = await db.query.Quiz.findMany({
    where: eq(Quiz.uid, uid),
    orderBy: (quizzes, { desc }) => desc(quizzes.updatedAt),
    limit: 6,
    with: {
      quizRounds: {
        columns: {},
        with: {
          round: {
            columns: {
              id: true,
            },
            with: {
              roundQuestions: {
                columns: {},
                with: {
                  question: {
                    columns: {
                      id: true,
                      points: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return formatQuizzesApiResponse(quizzes);
};
