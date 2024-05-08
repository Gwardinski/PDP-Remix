import { eq } from "drizzle-orm";
import { db } from "../db";
import { Quiz } from "../schema";

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

  return formatQuiz(quiz);
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

  return formatQuizzes(quizzes);
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

  return formatQuizzes(quizzes);
};

export const dbQuizGetFromRound = async (rid: number) => {
  return await db.query.quizToRound.findMany({
    with: {
      quiz: {
        with: {
          quizRounds: true,
        },
      },
    },

    where: (quizToRound, { eq }) => {
      return eq(quizToRound.rid, rid);
    },
  });
};

export const dbQuizGetForRound = async (uid: number, rid: number) => {
  const quizzes = await db.query.Quiz.findMany({
    with: {
      quizRounds: true,
    },

    where: (quizzes, { and, eq, ne }) => {
      return and(eq(quizzes.uid, uid), ne(quizzes.published, true));
    },
  });
  // TODO: how do I do this as part of the request?
  return quizzes.filter((quiz) => {
    return quiz.quizRounds.every((qr) => qr.rid !== rid);
  });
};

// TODO: how tf do I get Drizzle to do this for me?
function formatQuizzes(
  quizzes: {
    id: number;
    createdAt: string;
    updatedAt: string;
    uid: number;
    title: string;
    published: boolean;
    description: string | null;
    quizRounds: {
      round: {
        id: number;
        roundQuestions: {
          question: {
            id: number;
            points: number;
          };
        }[];
      };
    }[];
  }[],
) {
  return quizzes.map((quiz) => {
    return {
      id: quiz.id,
      uid: quiz.uid,
      title: quiz.title,
      description: quiz.description,
      published: quiz.published,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      noOfRounds: quiz.quizRounds.length,
      noOfQuestions: quiz.quizRounds.reduce((accumulator, quizRound) => {
        return (
          accumulator +
          quizRound.round.roundQuestions.reduce(
            (roundAccumulator, roundQuestion) => {
              return roundAccumulator + roundQuestion.question.points;
            },
            0,
          )
        );
      }, 0),
      totalPoints: quiz.quizRounds.reduce((accumulator, quizRound) => {
        return (
          accumulator +
          quizRound.round.roundQuestions.reduce(
            (roundAccumulator, roundQuestion) => {
              return roundAccumulator + roundQuestion.question.points;
            },
            0,
          )
        );
      }, 0),
    };
  });
}

// TODO: how tf do I get Drizzle to do this for me?
function formatQuiz(quiz: {
  uid: number;
  id: number;
  title: string;
  description: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  quizRounds: {
    round: {
      uid: number;
      id: number;
      title: string;
      description: string;
      published: boolean;
      createdAt: string;
      updatedAt: string;
      roundQuestions: {
        question: {
          uid: number;
          id: number;
          createdAt: string;
          updatedAt: string;
          title: string;
          answer: string;
          points: number;
          category: string;
          published: boolean;
        };
      }[];
    };
  }[];
}) {
  return {
    id: quiz.id,
    uid: quiz.uid,
    title: quiz.title,
    description: quiz.description,
    published: quiz.published,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
    noOfRounds: quiz.quizRounds.length,
    noOfQuestions: quiz.quizRounds.reduce((accumulator, quizRound) => {
      return (
        accumulator +
        quizRound.round.roundQuestions.reduce(
          (roundAccumulator, roundQuestion) => {
            return roundAccumulator + roundQuestion.question.points;
          },
          0,
        )
      );
    }, 0),
    totalPoints: quiz.quizRounds.reduce((accumulator, quizRound) => {
      return (
        accumulator +
        quizRound.round.roundQuestions.reduce(
          (roundAccumulator, roundQuestion) => {
            return roundAccumulator + roundQuestion.question.points;
          },
          0,
        )
      );
    }, 0),
  };
}
