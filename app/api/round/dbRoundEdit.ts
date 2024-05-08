import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { Round, roundToQuestion } from "../schema";

type RoundEditDetailsType = {
  uid: number;
  id: number;
  title: string;
  description: string;
};
export const dbRoundEditDetails = async ({
  uid,
  id,
  title,
  description,
}: RoundEditDetailsType) => {
  await db
    .update(Round)
    .set({ title, description })
    .where(and(eq(Round.id, id), eq(Round.uid, uid)));

  return true;
};

type RoundRemoveChildType = {
  uid: number;
  rid: number;
  qid: number;
};
export const dbRoundRemoveChild = async ({
  uid,
  rid,
  qid,
}: RoundRemoveChildType) => {
  await db.transaction(async (tx) => {
    // Update Round 'noOfQuestions' && check ownership / published
    //  todo

    // Create link between Round and Question
    await tx
      .delete(roundToQuestion)
      .where(and(eq(roundToQuestion.qid, qid), eq(roundToQuestion.rid, rid)));
  });

  return true;
};
