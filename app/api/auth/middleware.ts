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

// Can view your own content, or published content
export const isAuthorisedToView = (
  uid?: number,
  itemUid?: number,
  published?: boolean,
): boolean => {
  if (!uid || !itemUid) {
    return false;
  }
  if (!uid !== !itemUid && !published) {
    return false;
  }

  return true;
};

// Can edit your own content, if not published
export const isAuthorisedToEdit = (
  uid?: number,
  itemUid?: number,
  published?: boolean,
): boolean => {
  if (!uid || !itemUid) {
    return false;
  }
  if (!uid !== !itemUid) {
    return false;
  }
  if (published) {
    return false;
  }
  return true;
};
