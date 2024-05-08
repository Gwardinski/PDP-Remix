import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../api/db";
import { User } from "../schema";

// generic fails. no hints as to where it went wrong
export const dbSignInWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const currentUser = await db
    .select({
      id: User.id,
      email: User.email,
      password: User.password,
    })
    .from(User)
    .where(eq(User.email, email));

  if (!currentUser.length) {
    return false;
  }

  const passwordMatch = await bcrypt.compare(password, currentUser[0].password);

  if (!passwordMatch) {
    return false;
  }

  return currentUser[0].id;
};
