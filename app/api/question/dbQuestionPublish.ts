import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { Question } from "../schema";

type QuestionPublishType = {
  uid: number;
  qid: number;
};
export const dbQuestionPublish = async ({ uid, qid }: QuestionPublishType) => {
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
