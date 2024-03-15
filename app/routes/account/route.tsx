import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLocation,
  useRouteLoaderData,
} from "@remix-run/react";
import { authCookie } from "~/api/auth/authCookie";
import {
  CodeSnippet,
  DocumentationLink,
  GithubLink,
  VideoLink,
} from "~/components/DocText";
import { PageAccordion, PageHeader, PageLayout } from "~/components/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  H1,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui";
import { RootLoader } from "~/root";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let cookieString = request.headers.get("Cookie");
  let userId = await authCookie.parse(cookieString);
  if (!userId) {
    return redirect("/sign-in");
  }
  return null;
};

const AccountLayoutPage = () => {
  const data = useRouteLoaderData<RootLoader>("root");
  const pathname = useLocation().pathname;

  return (
    <PageLayout>
      <PageHeader>
        <H1>Account - {data?.user?.name}</H1>
        <PageAccordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="description">
              <AccordionTrigger className="gap-4">
                <div className="flex items-start justify-start gap-2">
                  Using <CodeSnippet>remix-hook-form</CodeSnippet> to edit
                  Account
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6">
                <GithubLink
                  text="Source Code"
                  href="https://github.com/Gwardinski/PDP-Remix/tree/main/app/routes"
                />
                <DocumentationLink
                  href="https://www.npmjs.com/package/remix-hook-form"
                  text="Remix Hook Form"
                />
                <VideoLink
                  href="https://www.youtube.com/watch?v=iom5nnj29sY"
                  text="Mastering Form Submissions in Remix with react-hook-form, remix-hook-form, zod, and Shadcn-UI"
                />
                <VideoLink
                  href="https://youtube.com/playlist?list=PLXoynULbYuED9b2k5LS44v9TQjfXifwNu&si=iXhxzfb03tivk4BH"
                  text="Trellix: build a Trello clone using Remix"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageAccordion>
      </PageHeader>

      <Tabs defaultValue={pathname} value={pathname}>
        <TabsList>
          <Link to="/account">
            <TabsTrigger value="/account">Your Account</TabsTrigger>
          </Link>
          <Link to="/account/edit">
            <TabsTrigger value="/account/edit">Edit</TabsTrigger>
          </Link>
        </TabsList>
        <TabsContent value={pathname}>
          <Outlet />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default AccountLayoutPage;
