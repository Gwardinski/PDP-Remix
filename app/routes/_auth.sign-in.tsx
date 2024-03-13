import { Link, Outlet, useLocation } from "@remix-run/react";
import {
  CodeSnippet,
  DocumentationLink,
  GithubLink,
  VideoLink,
} from "~/components/DocText";
import {
  PageAccordionDescription,
  PageHeader,
  PageLayout,
  PageTitle,
} from "~/components/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui";

const SignInPage = () => {
  const location = useLocation();
  const r = location.pathname.split("/")[2];

  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>Supabase Auth - Sign In</PageTitle>
        <PageAccordionDescription>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="gap-4">
                <div className="flex items-start justify-start gap-2">
                  Using <CodeSnippet>@supabase/ssr</CodeSnippet> &{" "}
                  <CodeSnippet>remix-hook-form</CodeSnippet> to sign in
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6">
                <GithubLink text="Source Code" href="/TODO" />
                <DocumentationLink
                  href="https://supabase.com/docs/guides/auth/server-side/creating-a-client"
                  text="Supabase Auth"
                />
                <DocumentationLink
                  href="https://www.npmjs.com/package/remix-hook-form"
                  text="Remix Hook Form"
                />
                <VideoLink
                  href="https://www.youtube.com/watch?v=iom5nnj29sY"
                  text="Mastering Form Submissions in Remix with react-hook-form, remix-hook-form, zod, and Shadcn-UI"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageAccordionDescription>
      </PageHeader>

      <Tabs defaultValue={r} value={r}>
        <TabsList>
          <Link to="/sign-in/code">
            <TabsTrigger value="code">Passwordless Sign in</TabsTrigger>
          </Link>
          <Link to="/sign-in/password">
            <TabsTrigger value="password">Sign in with Password</TabsTrigger>
          </Link>
        </TabsList>

        <TabsContent value={r} className="py-4">
          <Outlet />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default SignInPage;
