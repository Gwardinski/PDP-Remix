import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { Quiz } from "../schema";

type QuizEditDetailsType = {
  uid: number;
  id: number;
  title: string;
  description: string;
};
export const dbQuizEditDetails = async ({
  uid,
  id,
  title,
  description,
}: QuizEditDetailsType) => {
  await db
    .update(Quiz)
    .set({ title, description })
    .where(and(eq(Quiz.id, id), eq(Quiz.uid, uid)));
  return true;
};
