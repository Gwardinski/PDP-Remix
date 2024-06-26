import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLocation,
  useRouteLoaderData,
} from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import {
  CodeSnippet,
  DocumentationLink,
  GithubLink,
  VideoLink,
} from "~/components/DocText";
import {
  Page,
  PageHeader,
  PageHeaderAccordion,
  PageHeading,
} from "~/components/layout";
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
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  return true;
};

const AccountLayoutPage = () => {
  const data = useRouteLoaderData<RootLoader>("root");
  const pathname = useLocation().pathname;

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <H1>Account - {data?.user?.name}</H1>
        </PageHeading>
        <PageHeaderAccordion>
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
        </PageHeaderAccordion>
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
    </Page>
  );
};

export default AccountLayoutPage;
