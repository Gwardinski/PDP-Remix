import { eq } from "drizzle-orm";
import { db } from "~/api/db";
import { users } from "~/api/schema";

export const updateUsersName = async (id: number, name: string) => {
  await db.update(users).set({ name }).where(eq(users.id, id));
};
