import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { authCookie } from "~/api/auth/authCookie";
import { Unauthenticated } from "~/components/Unauthenticated";
import { PageHeader, PageLayout } from "~/components/layout";
import { H1 } from "~/components/ui";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let cookieString = request.headers.get("Cookie");
  let userId = await authCookie.parse(cookieString);
  if (!userId) {
    return false;
  }
  return true;
};

const KTLayoutPage = () => {
  const response = useLoaderData<typeof loader>();
  const loggedIn = response;
  return (
    <PageLayout>
      <PageHeader>
        <H1>KT</H1>
      </PageHeader>

      {loggedIn ? <Outlet /> : <Unauthenticated />}
    </PageLayout>
  );
};

export default KTLayoutPage;
