import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createSupabaseServerClient } from "~/supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();
  const { error } = await supabaseClient.auth.signInWithOtp({
    email: formData.get("email") as string,
    options: {
      emailRedirectTo: "http://localhost:3000/auth-callback",
    },
  });
  if (error) {
    return json({ success: false }, { headers });
  }
  return json({ success: true }, { headers });
};

const SignUp = () => {
  const response = useActionData<typeof action>();

  return (
    <>
      {!response?.success ? (
        <Form method="post">
          <input type="email" name="email" placeholder="Your Email" required />
          <br />
          <button type="submit">Sign In</button>
        </Form>
      ) : (
        <h3>Please check your email.</h3>
      )}
    </>
  );
};

export default SignUp;
