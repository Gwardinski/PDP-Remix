import { MetaFunction } from "@remix-run/node";
import {
  BugText,
  DocumentationLink,
  FunctionalText,
  GithubLink,
  NonFunctionalText,
  RefreshText,
  VideoLink,
} from "~/components/DocText";
import { PageAccordion, PageHeader, PageLayout } from "~/components/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  H1,
} from "~/components/ui";
import QuizEditor from "./editor";
import QuizEditorLibrary from "./library";

export const meta: MetaFunction = () => {
  return [
    { title: "PDP Quiz" },
    {
      name: "DnD Kit Quiz",
      content: "Using DnD Kit & Zustand to create a 'Trello' style quiz app",
    },
  ];
};

export default function QuizPage() {
  return (
    <PageLayout>
      <PageHeader>
        <H1>{"Quiz 'Trello' Board"}</H1>
        <PageAccordion>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="gap-4">
                <div className="flex flex-col items-start justify-start gap-2">
                  <p>Interface for editing a Quiz, using DnD Kit & Zustand.</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6">
                <GithubLink
                  text="Source Code"
                  href="https://github.com/Gwardinski/PDP-Remix/tree/main/app/routes/quiz"
                />
                <DocumentationLink
                  href="https://www.npmjs.com/package/zustand#typescript-usage"
                  text="Zustand Docs"
                />
                <DocumentationLink
                  href="https://dndkit.com/"
                  text="DnD Kit Docs"
                />
                <VideoLink
                  href="https://www.youtube.com/watch?v=RG-3R6Pu_Ik"
                  text="DnD Kit Youtube Tutorial"
                />
                <FunctionalText text="Adding, Removing, and Ordering all work as expected" />
                <NonFunctionalText
                  text="Search functionality is non-functional and just for example
                    purposes"
                />
                <NonFunctionalText
                  text="Menu functionality - edit, publish delete is non-functional and just for example
                    purposes"
                />
                <RefreshText text="Refresh page to reset data" />
                <BugText text="Can't drag Question into Empty Round" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageAccordion>
      </PageHeader>

      <div className="flex flex-col gap-8 lg:flex-row">
        <QuizEditor />
        <QuizEditorLibrary />
      </div>
    </PageLayout>
  );
}
