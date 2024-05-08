import { db } from "../db";
import { quizToRound } from "../schema";

// Get selected Round, and ids for any Quizzes it has already been added to
type QuizAddChildGetRoundProps = {
  uid: number;
  rid: number;
};
export const dbQuizAddChildGetChild = async ({
  uid,
  rid,
}: QuizAddChildGetRoundProps) => {
  return await db.query.Round.findFirst({
    with: {
      quizRounds: true,
    },
    where: (rounds, { and, eq }) =>
      and(eq(rounds.id, rid), eq(rounds.uid, uid)),
  });
};

// Gets list of users Quizzes, filtered by any zids the Round is already part of
type QuizGetPossibleRoundParentsProps = {
  uid: number;
  query: string;
  currentZids: number[];
};
export const dbQuizAddChildGet = async ({
  uid,
  query,
  currentZids,
}: QuizGetPossibleRoundParentsProps) => {
  return await db.query.Quiz.findMany({
    where: (quizzes, { eq, ilike, and, notInArray }) => {
      if (currentZids.length === 0) {
        return and(eq(quizzes.uid, uid), ilike(quizzes.title, `%${query}%`));
      }
      return and(
        eq(quizzes.uid, uid),
        ilike(quizzes.title, `%${query}%`),
        notInArray(quizzes.id, currentZids),
      );
    },
  });
};

// Adds a Round to a Quiz
type QuizAddChildProps = {
  uid: number;
  zid: number;
  rid: number;
};
export const dbQuizAddChild = async ({ uid, zid, rid }: QuizAddChildProps) => {
  await db.transaction(async (tx) => {
    // Check Quiz exists
    const quizToUpdate = await tx.query.Quiz.findFirst({
      where: (quizzes, { and, eq }) =>
        and(eq(quizzes.id, zid), eq(quizzes.uid, uid)),
    });
    if (!quizToUpdate) {
      return false;
    }

    // Check Round exists
    const roundToUpdate = await tx.query.Round.findFirst({
      where: (rounds, { and, or, eq }) =>
        and(
          eq(rounds.id, rid),
          or(eq(rounds.uid, uid), eq(rounds.published, true)),
        ),
    });
    if (!roundToUpdate) {
      return false;
    }

    // Check link doesn't exist
    const existingLink = await tx.query.quizToRound.findFirst({
      where: (quizToRound, { and, eq }) =>
        and(eq(quizToRound.zid, zid), eq(quizToRound.rid, rid)),
    });
    if (existingLink) {
      return false;
    }

    // Create the link
    await tx.insert(quizToRound).values({ zid: zid, rid: rid });
  });

  return true;
};
