import { Outlet } from "@remix-run/react";
import {
  CodeSnippet,
  DocumentationLink,
  GithubLink,
  VideoLink,
} from "~/components/DocText";
import { Page, PageAccordion, PageHeader } from "~/components/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  H1,
} from "~/components/ui";

const AuthLayoutPage = () => {
  return (
    <Page>
      <PageHeader>
        <H1>Authentication</H1>
        <PageAccordion>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="gap-4">
                <div className="flex items-start justify-start gap-2">
                  Using <CodeSnippet>remix-hook-form</CodeSnippet> to register
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

      <Outlet />
    </Page>
  );
};

export default AuthLayoutPage;
