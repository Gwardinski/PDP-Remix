import { db } from "../db";
import { Quiz, quizToRound } from "../schema";

type Quiz = typeof Quiz.$inferInsert;

type QuizCreateType = {
  uid: number;
  title: string;
  description: string;
  rid?: number;
};
export const dbQuizCreate = async ({
  uid,
  title,
  description,
  rid,
}: QuizCreateType) => {
  const newItem: Quiz = {
    uid,
    title,
    description,
  };
  const newQuiz = await db.insert(Quiz).values(newItem).returning();

  if (!rid) {
    return true;
  }

  const round = await db.query.Round.findFirst({
    where: (round, { and, or, eq }) =>
      and(eq(round.id, rid), or(eq(round.published, true), eq(round.uid, uid))),
  });

  if (!round) {
    return false;
  }

  const zid = newQuiz[0].id;

  await db.insert(quizToRound).values({ rid, zid });
};
