import { db } from "../db";
import { roundToQuestion } from "../schema";

export const dbRoundGet = async (rid: number) => {
  // Add user id and check for ownership / permissions / isPublished
  return await db.query.Round.findFirst({
    with: {
      quizRounds: true,
      roundQuestions: {
        with: {
          question: true,
        },
      },
    },

    where: (round, { eq }) => eq(round.id, rid),
  });
};

export const dbRoundsGetLibrary = async (
  uid: number,
  query: string = "",
  filterRids: number[] = [],
) => {
  return await db.query.Round.findMany({
    with: {
      quizRounds: true,
      roundQuestions: true,
    },

    where: (round, { eq, ilike, and, notInArray }) => {
      if (filterRids.length === 0) {
        return and(eq(round.uid, uid), ilike(round.title, `%${query}%`));
      }
      return and(
        eq(round.uid, uid),
        ilike(round.title, `%${query}%`),
        notInArray(round.id, filterRids),
      );
    },
  });
};

export const dbRoundsGetRecent = async (uid: number) => {
  return await db.query.Round.findMany({
    with: {
      quizRounds: true,
      roundQuestions: true,
    },

    where: (round, { eq }) => eq(round.uid, uid),
    orderBy: (round, { desc }) => desc(round.updatedAt),
    limit: 6,
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
