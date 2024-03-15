import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../schema";

export const getUserFromId = async (id: number) => {
  if (!id) {
    return null;
  }
  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      // all except password
    })
    .from(users)
    .where(eq(users.id, id));
  return user[0];
};
