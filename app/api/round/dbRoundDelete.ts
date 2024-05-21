import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { Round, quizToRound, roundToQuestion } from "../schema";

type RoundDeleteType = {
  uid: number;
  rid: number;
};
export const dbRoundDelete = async ({ uid, rid }: RoundDeleteType) => {
  await db.transaction(async (tx) => {
    const roundToDelete = await db.query.Round.findFirst({
      where: (round, { eq, and }) =>
        and(eq(round.id, rid), eq(round.uid, uid), eq(round.published, false)),
    });

    if (!roundToDelete) {
      return false;
    }

    await tx.delete(quizToRound).where(eq(quizToRound.rid, rid));
    await tx.delete(roundToQuestion).where(eq(roundToQuestion.rid, rid));
    await tx.delete(Round).where(and(eq(Round.id, rid), eq(Round.uid, uid)));
  });
  return true;
};
