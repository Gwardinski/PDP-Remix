import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const { supabaseClient, headers } = createSupabaseServerClient(request);
    try {
      const { error } = await supabaseClient.auth.exchangeCodeForSession(code);
      if (error) {
        return redirect("/sign-in");
      }
      return redirect("/password-new", {
        headers,
      });
    } catch (error) {
      console.log(error);
      return new Response("Authentication failed", {
        status: 400,
      });
    }
  }
  return new Response("Authentication failed", {
    status: 400,
  });
};
