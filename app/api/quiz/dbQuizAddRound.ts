import { db } from "../db";
import { quizToRound } from "../schema";

// Get selected Round, and ids for any Quizzes it has already been added to
type QuizAddRoundGetRoundProps = {
  uid: number;
  rid: number;
};
export const dbQuizAddRoundGetRound = async ({
  uid,
  rid,
}: QuizAddRoundGetRoundProps) => {
  return await db.query.Round.findFirst({
    where: (round, { and, eq }) => and(eq(round.id, rid), eq(round.uid, uid)),
    with: {
      quizRounds: true,
    },
  });
};

// Gets list of users Quizzes, filtered by any rids the Round is already part of
type QuizAddRoundGetQuizzesProps = {
  uid: number;
  query: string;
  currentZids: number[];
};
export const dbQuizAddRoundGetQuizzes = async ({
  uid,
  query,
  currentZids,
}: QuizAddRoundGetQuizzesProps) => {
  const quizzes = await db.query.Quiz.findMany({
    where: (quiz, { eq, ilike, and, notInArray }) => {
      if (currentZids.length === 0) {
        return and(
          eq(quiz.uid, uid),
          eq(quiz.published, false),
          ilike(quiz.title, `%${query}%`),
        );
      }
      return and(
        eq(quiz.uid, uid),
        eq(quiz.published, false),
        ilike(quiz.title, `%${query}%`),
        notInArray(quiz.id, currentZids),
      );
    },
    columns: {
      id: true,
      uid: true,
      title: true,
    },
    with: {
      quizRounds: true,
    },
  });

  return quizzes.map((quiz) => {
    return {
      id: quiz.id,
      uid: quiz.uid,
      title: quiz.title,
      noOfRounds: quiz.quizRounds.length,
    };
  });
};

// Adds a Round to a Quiz
type QuizAddChildProps = {
  uid: number;
  zid: number;
  rid: number;
};
export const dbQuizAddRound = async ({ uid, zid, rid }: QuizAddChildProps) => {
  await db.transaction(async (tx) => {
    // Check Round exists and is either owned or published
    const round = await db.query.Round.findFirst({
      where: (round, { and, eq, or }) =>
        and(
          eq(round.id, rid),
          or(eq(round.uid, uid), eq(round.published, true)),
        ),
    });
    if (!round) {
      return false;
    }

    // Check Quiz exists and is owned
    const quiz = await db.query.Quiz.findFirst({
      where: (quiz, { and, eq }) => and(eq(quiz.id, zid), eq(quiz.uid, uid)),
    });
    if (!quiz) {
      return false;
    }

    // Create link between Quiz and Round
    await tx.insert(quizToRound).values({ rid: rid, zid: zid });
  });

  return true;
};
