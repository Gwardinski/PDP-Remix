import { db } from "../db";
import { roundToQuestion } from "../schema";

export const dbRoundGet = async ({
  rid,
  uid,
}: {
  rid: number;
  uid: number;
}) => {
  const round = await db.query.Round.findFirst({
    where: (round, { and, or, eq }) =>
      and(eq(round.id, rid), or(eq(round.published, true), eq(round.uid, uid))),
    with: {
      quizRounds: {
        columns: {
          zid: true,
        },
      },
      roundQuestions: {
        columns: {},
        with: {
          question: {
            with: {
              roundQuestions: {
                columns: {
                  rid: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!round) {
    return null;
  }

  return formatRound(round);
};

export const dbRoundsGetLibrary = async (uid: number, query: string = "") => {
  const rounds = await db.query.Round.findMany({
    where: (round, { eq, ilike, and }) => {
      return and(eq(round.uid, uid), ilike(round.title, `%${query}%`));
    },
    with: {
      quizRounds: true,
      roundQuestions: true,
    },
  });

  return rounds.map((r) => {
    return {
      id: r.id,
      uid: r.uid,
      title: r.title,
      description: r.description,
      published: r.published,
      updatedAt: r.updatedAt,
      createdAt: r.createdAt,
      noOfQuestions: r.roundQuestions.length,
      noOfQuizzes: r.quizRounds.length,
    };
  });
};

export const dbRoundsGetRecent = async (uid: number) => {
  const rounds = await db.query.Round.findMany({
    where: (round, { eq }) => eq(round.uid, uid),
    orderBy: (round, { desc }) => desc(round.updatedAt),
    limit: 6,
    with: {
      quizRounds: true,
      roundQuestions: true,
    },
  });

  return rounds.map((r) => {
    return {
      id: r.id,
      uid: r.uid,
      title: r.title,
      description: r.description,
      published: r.published,
      updatedAt: r.updatedAt,
      createdAt: r.createdAt,
      noOfQuestions: r.roundQuestions.length,
      noOfQuizzes: r.quizRounds.length,
    };
  });
};

export const dbRoundsGetFromQuestion = async ({
  qid,
  query,
  rid,
}: {
  qid: number;
  query: string;
  rid?: number;
}) => {
  let rtq = await db.query.Round.findMany({
    where: (round, { eq, and, inArray, ilike }) =>
      and(
        inArray(
          round.id,
          db
            .select({ rid: roundToQuestion.rid })
            .from(roundToQuestion)
            .where(eq(roundToQuestion.qid, qid)),
        ),
        ilike(round.title, `%${query}%`),
      ),
    with: {
      quizRounds: true,
      roundQuestions: true,
    },
  });
  if (rid) {
    rtq = rtq.filter((r) => r.id !== rid);
  }
  return rtq.map((r) => {
    return {
      id: r.id,
      uid: r.uid,
      title: r.title,
      noOfQuestions: r.roundQuestions.length,
      noOfQuizzes: r.quizRounds.length,
    };
  });
};

// TODO: how tf do I get Drizzle to do this for me?
function formatRound(round: {
  uid: number;
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  published: boolean;
  description: string;
  quizRounds: {
    zid: number;
  }[];
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
      roundQuestions: {
        rid: number;
      }[];
    };
  }[];
}) {
  return {
    id: round.id,
    uid: round.uid,
    title: round.title,
    description: round.description,
    published: round.published,
    createdAt: round.createdAt,
    updatedAt: round.updatedAt,
    noOfQuizzes: round.quizRounds.length,
    noOfQuestions: round.roundQuestions.length,
    totalPoints: round.roundQuestions.reduce(
      (acc, rq) => acc + rq.question.points,
      0,
    ),
    questions: round.roundQuestions.map((rq) => {
      return {
        id: rq.question.id,
        uid: rq.question.uid,
        title: rq.question.title,
        answer: rq.question.answer,
        points: rq.question.points,
        category: rq.question.category,
        published: rq.question.published,
        createdAt: rq.question.createdAt,
        updatedAt: rq.question.updatedAt,
        noOfRounds: rq.question.roundQuestions.length,
      };
    }),
  };
}
