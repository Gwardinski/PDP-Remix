import { db } from "../db";
import { Question, roundToQuestion } from "../schema";

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
    const round = await db.query.Round.findFirst({
      where: (round, { and, eq }) =>
        and(eq(round.id, rid), eq(round.published, false), eq(round.uid, uid)),
    });

    if (!round) {
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
      .values({ rid: round.id, qid: newQid[0].id });
  });
  return true;
};
