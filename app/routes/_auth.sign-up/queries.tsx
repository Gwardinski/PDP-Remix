import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../api/db";
import { profiles, users } from "../../api/schema";

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string,
) => {
  const hash = await bcrypt.hash(password, 10);

  return await db.transaction(async (tx) => {
    const userRes = await tx
      .insert(users)
      .values({ email, password: hash, name })
      .returning({ id: users.id });
    await tx.insert(profiles).values({ uid: userRes[0].id });
    return userRes[0].id;
  });
};

export const checkAccountAlreadyExists = async (email: string) => {
  const user = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.email, email));
  if (user.length > 0) {
    return true;
  }
  return false;
};
