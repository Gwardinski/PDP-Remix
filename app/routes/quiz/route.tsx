import { Link, Outlet, useLocation } from "@remix-run/react";
import { PageHeader, PageHeading, PageLayout } from "~/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui";

const QuizLibraryPage = () => {
  const pathname = useLocation().pathname;

  return (
    <PageLayout>
      <PageHeader>
        <PageHeading>Library</PageHeading>
      </PageHeader>

      <Tabs value={pathname}>
        <TabsList>
          <Link to={"/quiz/questions"}>
            <TabsTrigger value="/quiz/questions">Questions</TabsTrigger>
          </Link>
          <Link to={"/quiz/rounds"}>
            <TabsTrigger value="/quiz/rounds">Rounds</TabsTrigger>
          </Link>
        </TabsList>
        <TabsContent value={pathname}>
          <Outlet />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default QuizLibraryPage;
