import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { Question, roundToQuestion } from "../schema";

export const dbQuestionDelete = async ({
  uid,
  qid,
}: {
  uid: number;
  qid: number;
}) => {
  await db.transaction(async (tx) => {
    const questionToDelete = await db.query.Question.findFirst({
      where: (question, { eq, and }) =>
        and(
          eq(question.id, qid),
          eq(question.uid, uid),
          eq(question.published, false),
        ),
    });

    if (!questionToDelete) {
      return false;
    }

    await tx.delete(roundToQuestion).where(eq(roundToQuestion.qid, qid));
    await tx
      .delete(Question)
      .where(and(eq(Question.id, qid), eq(Question.uid, uid)));
  });

  return true;
};
