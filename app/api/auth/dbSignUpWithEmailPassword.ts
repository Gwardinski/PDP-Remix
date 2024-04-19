import bcrypt from "bcryptjs";
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
