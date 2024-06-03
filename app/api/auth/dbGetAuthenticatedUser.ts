import { db } from "../db";
import { isAuthenticated } from "./middleware";

export const dbGetAuthenticatedUser = async (request: Request) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return null;
  }
  const user = await db.query.User.findFirst({
    where: (user, { eq }) => eq(user.id, uid),
  });
  return user;
};
