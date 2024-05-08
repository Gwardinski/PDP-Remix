import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { User } from "../schema";

export const dbSignUpWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string,
) => {
  const hash = await bcrypt.hash(password, 10);

  return await db.transaction(async (tx) => {
    const userRes = await tx
      .insert(User)
      .values({ email, password: hash, name })
      .returning({ id: User.id });
    return userRes[0].id;
  });
};

export const checkAccountAlreadyExists = async (email: string) => {
  const user = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.email, email));
  if (user.length > 0) {
    return true;
  }
  return false;
};
