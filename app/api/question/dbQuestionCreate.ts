import { db } from "../db";
import { Question } from "../schema";

type Question = typeof Question.$inferInsert;

type QuestionCreateType = {
  uid: number;
  title: string;
  answer: string;
  points: number;
  category: string;
};
export const dbQuestionCreate = async ({
  uid,
  title,
  answer,
  points,
  category,
}: QuestionCreateType) => {
  const newItem: Question = {
    uid,
    title,
    answer,
    points,
    category,
  };
  await db.insert(Question).values(newItem);
  return true;
};
