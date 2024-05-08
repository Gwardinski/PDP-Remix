import { db } from "../db";
import { roundToQuestion } from "../schema";

export const dbRoundGet = async (rid: number) => {
  // Add user id and check for ownership / permissions / isPublished
  return await db.query.Round.findFirst({
    where: (round, { eq }) => eq(round.id, rid),
    with: {
      quizRounds: true,
      roundQuestions: {
        with: {
          question: true,
        },
      },
    },
  });
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
}: {
  qid: number;
  query: string;
}) => {
  const rtq = await db.query.Round.findMany({
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
