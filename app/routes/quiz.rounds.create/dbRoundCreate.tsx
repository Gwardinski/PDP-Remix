import { db } from "~/api/db";
import { rounds } from "~/api/schema";
import { RoundCreateFormType } from "./route";

type Round = typeof rounds.$inferInsert;
export const dbRoundCreate = async (
  { title, description }: RoundCreateFormType,
  uid: number,
) => {
  const newItem: Round = {
    title,
    description,
    uid,
  };
  await db.insert(rounds).values(newItem);
  return true;
};
