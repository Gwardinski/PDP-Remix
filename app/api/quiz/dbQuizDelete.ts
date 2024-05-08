import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { Quiz, quizToRound } from "../schema";

type QuizDeleteType = {
  uid: number;
  zid: number;
};
export const dbQuizDelete = async ({ uid, zid }: QuizDeleteType) => {
  await db.transaction(async (tx) => {
    await tx.delete(quizToRound).where(eq(quizToRound.zid, zid));
    await tx.delete(Quiz).where(and(eq(Quiz.id, zid), eq(Quiz.uid, uid)));
  });
  return true;
};
