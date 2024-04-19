import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import { Unauthenticated } from "~/components/Unauthenticated";
import { Page, PageHeader } from "~/components/layout";
import { H1 } from "~/components/ui";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  return true;
};

const KTLayoutPage = () => {
  const response = useLoaderData<typeof loader>();
  const loggedIn = response;
  return (
    <Page>
      <PageHeader>
        <H1>KT</H1>
      </PageHeader>

      {loggedIn ? <Outlet /> : <Unauthenticated />}
    </Page>
  );
};

export default KTLayoutPage;
