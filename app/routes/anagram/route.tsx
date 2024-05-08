import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import {
  BugText,
  CodeSnippet,
  DocumentationLink,
  GithubLink,
} from "~/components/DocText";
import { Unauthenticated } from "~/components/Unauthenticated";
import { Page, PageAccordion, PageHeader } from "~/components/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  H1,
} from "~/components/ui";

// make public? 🤔
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  return true;
};

const AnagramLayoutPage = () => {
  const response = useLoaderData<typeof loader>();
  const loggedIn = response;

  return (
    <Page>
      <PageHeader>
        <H1>Anagram Solver</H1>
        <PageAccordion>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="gap-4">
                <div className="flex items-start justify-start gap-2">
                  Using <CodeSnippet>chat gpt</CodeSnippet> to (badly) solve
                  anagrams.
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6">
                <GithubLink
                  href={
                    "https://github.com/Gwardinski/PDP-Remix/tree/main/app/routes/anagram._index"
                  }
                  text="Source Code"
                ></GithubLink>
                <DocumentationLink
                  href={
                    "https://platform.openai.com/docs/guides/text-generation"
                  }
                  text={"Open AI Docs"}
                ></DocumentationLink>
                <BugText text={"Turns out Chat GPT can't solve anagrams 🤷‍♂️"} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageAccordion>
      </PageHeader>

      {loggedIn ? <Outlet /> : <Unauthenticated />}
    </Page>
  );
};

export default AnagramLayoutPage;
