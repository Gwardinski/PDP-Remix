import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  return redirect("/library/recent");
}
