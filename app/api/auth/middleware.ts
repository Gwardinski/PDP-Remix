import { authCookie } from "./authCookie";

export const isAuthenticated = async (
  request: Request,
): Promise<number | null> => {
  const cookieString = request.headers.get("Cookie");
  const uid = await authCookie.parse(cookieString);
  if (!uid) {
    return null;
  }
  return uid;
};
