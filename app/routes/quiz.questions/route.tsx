import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, MetaFunction, Outlet, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { getAuthenticatedUserId } from "~/api/auth/authQueries";
import { db } from "~/api/db";
import { questions } from "~/api/schema";
import { PageHeader, PageHeading, PageLayout } from "~/components/layout";
import { Button, Card } from "~/components/ui";

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
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return redirect("/");
  }

  const uid = userId;
  const data = await db.select().from(questions).where(eq(questions.uid, uid));

  return json({
    data,
  });
}

const QuestionLibraryPage = () => {
  const { data } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <PageHeader>
        <PageHeading>Questions Library</PageHeading>
      </PageHeader>

      <div className="flex flex-col gap-4">
        <Link to={"/quiz/questions/create"} className="w-fit">
          <Button>Create Question</Button>
        </Link>

        <div className="flex flex-col gap-2">
          {data.map((q) => (
            <Card key={q.id} className="flex flex-col gap-1 p-2">
              <h6>{q.title}</h6>
              <p>{q.answer}</p>

              <div className="flex gap-2">
                <p>{q.points}</p>
                <p>{q.category}</p>
              </div>

              <div className="flex gap-2">
                <Link to={`/quiz/questions/${q.id}/edit`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <Link to={`/quiz/questions/${q.id}/delete`}>
                  <Button variant="destructive">Delete</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <Outlet />
      </div>
    </PageLayout>
  );
};

export default QuestionLibraryPage;
