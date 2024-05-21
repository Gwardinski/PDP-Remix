import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { Question, Round } from "../schema";

type RoundPublishType = {
  uid: number;
  rid: number;
};
export const dbRoundPublish = async ({ uid, rid }: RoundPublishType) => {
  await db.transaction(async (tx) => {
    const roundToPublish = await db.query.Round.findFirst({
      where: (round, { eq, and }) =>
        and(eq(round.id, rid), eq(round.uid, uid), eq(round.published, false)),
      with: {
        roundQuestions: {
          with: {
            question: true,
          },
        },
      },
    });

    if (!roundToPublish) {
      return false;
    }

    tx.update(Round)
      .set({ published: true })
      .where(and(eq(Round.id, rid), eq(Round.uid, uid)));

    const qs = roundToPublish.roundQuestions.map((r) => r.question);

    qs.forEach((q) => {
      tx.update(Question)
        .set({ published: true })
        .where(and(eq(Question.id, q.id), eq(Question.uid, uid)));
    });
  });
  return true;
};
