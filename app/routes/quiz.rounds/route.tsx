import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, MetaFunction, Outlet, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { getAuthenticatedUserId } from "~/api/auth/authQueries";
import { db } from "~/api/db";
import { rounds } from "~/api/schema";
import { PageHeader, PageHeading, PageLayout } from "~/components/layout";
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui";

export const meta: MetaFunction = () => {
  return [
    { title: "Round Library" },
    {
      name: "Round Library",
      content: "Your Round Library",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return redirect("/");
  }

  const uid = userId;
  const data = await db.select().from(rounds).where(eq(rounds.uid, uid));

  return json({
    data,
  });
}

const RoundLibraryPage = () => {
  const { data } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <PageHeader>
        <PageHeading>Rounds Library</PageHeading>
      </PageHeader>

      <div className="flex flex-col gap-4">
        <Link to={"/quiz/rounds/create"} className="w-fit">
          <Button>Create Round</Button>
        </Link>

        <div className="flex flex-col gap-2">
          {data.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <CardTitle>{r.title}</CardTitle>
                <CardDescription>{r.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link to={`/quiz/rounds/${r.id}/edit`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <Link to={`/quiz/rounds/${r.id}/delete`}>
                  <Button variant="destructive">Delete</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Outlet />
      </div>
    </PageLayout>
  );
};

export default RoundLibraryPage;
