import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { Question } from "../schema";

type QuestionEditType = {
  uid: number;
  id: number;
  title: string;
  answer: string;
  points: number;
  category: string;
};
export const dbQuestionEdit = async ({
  uid,
  id,
  title,
  answer,
  points,
  category,
}: QuestionEditType) => {
  await db
    .update(Question)
    .set({ title, answer, points, category })
    .where(
      and(
        eq(Question.id, id),
        eq(Question.uid, uid),
        eq(Question.published, false),
      ),
    );
  return true;
};
