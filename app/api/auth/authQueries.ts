import { db } from "../db";
import { authCookie } from "./authCookie";

export const getAuthenticatedUser = async (request: Request) => {
  let cookieString = request.headers.get("Cookie");
  let userId = await authCookie.parse(cookieString);
  if (!userId) {
    return null;
  }
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, 1),
  });
  return user;
};

export const getAuthenticatedUserId = async (
  request: Request,
): Promise<number | null> => {
  let cookieString = request.headers.get("Cookie");
  let userId = await authCookie.parse(cookieString);
  if (!userId) {
    return null;
  }
  return userId as number;
};

// export const getUserFromId = async (id: number) => {
//   if (!id) {
//     return null;
//   }
//   const user = await db
//     .select({
//       id: users.id,
//       name: users.name,
//       email: users.email,
//       createdAt: users.createdAt,
//       updatedAt: users.updatedAt,
//       // all except password
//     })
//     .from(users)
//     .where(eq(users.id, id));
//   return user[0];
// };
