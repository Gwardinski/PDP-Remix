import { eq } from "drizzle-orm";
import { db } from "~/api/db";
import { User } from "~/api/schema";

export const updateUsersName = async (id: number, name: string) => {
  await db.update(User).set({ name }).where(eq(User.id, id));
};
