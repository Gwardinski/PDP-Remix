import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../api/db";
import { users } from "../../api/schema";

// generic fails. no hints as to where it went wrong
export const signInWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const user = await db
    .select({
      id: users.id,
      email: users.email,
      password: users.password,
    })
    .from(users)
    .where(eq(users.email, email));

  if (!user.length) {
    return false;
  }

  const passwordMatch = await bcrypt.compare(password, user[0].password);

  if (!passwordMatch) {
    return false;
  }

  return user[0].id;
};
