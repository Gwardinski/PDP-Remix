import { db } from "~/api/db";
import { questions } from "~/api/schema";
import { QuestionCreateFormType } from "./route";

type Question = typeof questions.$inferInsert;
export const dbQuestionCreate = async (
  { title, answer, points, category }: QuestionCreateFormType,
  uid: number,
) => {
  const newItem: Question = {
    title,
    answer,
    points,
    category,
    uid,
  };
  await db.insert(questions).values(newItem);
  return true;
};
