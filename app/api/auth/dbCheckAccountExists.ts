import { eq } from "drizzle-orm";
import { db } from "../db";
import { User } from "../schema";

export const dbCheckAccountAlreadyExists = async (email: string) => {
  const existingUser = await db
    .select({ email: User.email })
    .from(User)
    .where(eq(User.email, email));
  if (existingUser.length > 0) {
    return true;
  }
  return false;
};
