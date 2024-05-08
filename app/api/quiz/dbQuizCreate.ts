import { db } from "../db";
import { Quiz } from "../schema";

type Quiz = typeof Quiz.$inferInsert;

type QuizCreateType = {
  uid: number;
  title: string;
  description: string;
};
export const dbQuizCreate = async ({
  uid,
  title,
  description,
}: QuizCreateType) => {
  const newItem: Quiz = {
    uid,
    title,
    description,
  };
  await db.insert(Quiz).values(newItem);
  return true;
};
