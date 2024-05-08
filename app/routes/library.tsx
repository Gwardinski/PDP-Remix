import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  MetaFunction,
  Outlet,
  redirect,
  useLocation,
} from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import { Page, PageHeader } from "~/components/layout";
import { H1, Tabs, TabsList, TabsTrigger } from "~/components/ui";

export const meta: MetaFunction = () => {
  return [
    { title: "Question Library" },
    {
      name: "Question Library",
      content: "Your Question Library",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  return true;
}

const LibraryPage = () => {
  const pathname = useLocation().pathname.split("/")[2] ?? "";

  return (
    <Page>
      <PageHeader>
        <H1>Your Library</H1>
        <nav>
          <Tabs value={pathname}>
            <TabsList>
              <TabsTrigger value="recent" asChild>
                <Link to="/library/recent">Recent</Link>
              </TabsTrigger>
              <TabsTrigger value="questions" asChild>
                <Link to="/library/questions">Questions</Link>
              </TabsTrigger>
              <TabsTrigger value="rounds" asChild>
                <Link to="/library/rounds">Rounds</Link>
              </TabsTrigger>
              <TabsTrigger value="quizzes" asChild>
                <Link to="/library/quizzes">Quizzes</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </nav>
      </PageHeader>

      <Outlet />
    </Page>
  );
};

export default LibraryPage;
