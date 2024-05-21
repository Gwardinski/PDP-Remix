import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const rid = Number(params.rid);
  if (!rid) {
    return redirect("/library/rounds");
  }
  return redirect(`/round/${rid}/questions`);
}
