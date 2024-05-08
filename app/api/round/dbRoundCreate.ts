import { db } from "../db";
import { quizToRound, Round } from "../schema";

type Round = typeof Round.$inferInsert;

type RoundCreateType = {
  uid: number;
  title: string;
  description: string;
};
export const dbRoundCreate = async ({
  uid,
  title,
  description,
}: RoundCreateType) => {
  const newItem: Round = {
    uid,
    title,
    description,
  };
  await db.insert(Round).values(newItem);
  return true;
};

type RoundCreateAsChildType = {
  uid: number;
  zid: number;
  title: string;
  description: string;
};
export const dbRoundCreateAsChild = async ({
  uid,
  zid,
  title,
  description,
}: RoundCreateAsChildType) => {
  const newItem: Round = {
    uid,
    title,
    description,
  };
  await db.transaction(async (tx) => {
    const round = await tx.insert(Round).values(newItem).returning();
    const rid = round[0].id;
    await tx.insert(quizToRound).values({ zid: zid, rid: rid });
  });

  return true;
};
