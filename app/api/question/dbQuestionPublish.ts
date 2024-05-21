import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { Question } from "../schema";

export const dbQuestionPublish = async ({
  uid,
  qid,
}: {
  uid: number;
  qid: number;
}) => {
  await db
    .update(Question)
    .set({ published: true })
    .where(
      and(
        eq(Question.id, qid),
        eq(Question.uid, uid),
        eq(Question.published, false),
      ),
    );
  return true;
};
