import { redirect } from "@remix-run/node";
import { authCookie } from "~/api/auth/authCookie";

// Sign out using <form method="post" action="sign-out" >
export const action = async () => {
  return redirect("/", {
    headers: {
      "Set-Cookie": await authCookie.serialize("", {
        maxAge: 0,
      }),
    },
  });
};

// Sign out using <Link to="sign-out >
export const loader = async () => {
  return redirect("/", {
    headers: {
      "Set-Cookie": await authCookie.serialize("", {
        maxAge: 0,
      }),
    },
  });
};
