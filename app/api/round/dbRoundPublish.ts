import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { Round } from "../schema";

type RoundPublishType = {
  uid: number;
  id: number;
};
export const dbRoundPublish = async ({ uid, id }: RoundPublishType) => {
  await db
    .update(Round)
    .set({ published: true })
    .where(and(eq(Round.id, id), eq(Round.uid, uid)));
  // TODO: Publish all Questions within the round
  return true;
};
