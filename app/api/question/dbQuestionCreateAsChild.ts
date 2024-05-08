import { and, eq, ne, sql } from "drizzle-orm";
import { db } from "../db";
import { Question, Round, roundToQuestion } from "../schema";

type Question = typeof Question.$inferInsert;

type QuestionCreateAsChildType = {
  uid: number;
  rid: number;
  title: string;
  answer: string;
  points: number;
  category: string;
};
export const dbQuestionCreateAsChild = async ({
  uid,
  rid,
  title,
  answer,
  points,
  category,
}: QuestionCreateAsChildType) => {
  const newItem: Question = {
    uid,
    title,
    answer,
    points,
    category,
  };
  await db.transaction(async (tx) => {
    // Update Round 'noOfQuestions' && check ownership / published
    const updatedRid = await tx
      .update(Round)
      .set({
        noOfQuestions: sql`${Round.noOfQuestions ?? 0} + 1`,
      })
      .where(
        and(eq(Round.id, rid), eq(Round.uid, uid), ne(Round.published, true)),
      )
      .returning({ id: Round.id });

    if (!updatedRid) {
      return false;
    }

    // Create new Question
    const newQid = await tx
      .insert(Question)
      .values(newItem)
      .returning({ id: Question.id });

    if (!newQid[0].id) {
      return false;
    }

    // Create link between Round and Question
    await tx
      .insert(roundToQuestion)
      .values({ rid: updatedRid[0].id, qid: newQid[0].id });
  });
  return true;
};
