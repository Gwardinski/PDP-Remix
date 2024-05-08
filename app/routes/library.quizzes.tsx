import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  MetaFunction,
  Outlet,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { isAuthenticated } from "~/api/auth";
import { dbQuizGetLibrary } from "~/api/quiz";
import { PageContent, PageContentHeader } from "~/components/layout";
import { QuizGrid, QuizItemLibrary } from "~/components/quizzes";
import { Button, Input } from "~/components/ui";

export const meta: MetaFunction = () => {
  return [
    { title: "Quiz Library" },
    {
      name: "Quiz Library",
      content: "Your Quiz Library",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }

  const q = new URL(request.url).searchParams.get("q") ?? "";

  const quizzes = await dbQuizGetLibrary(uid, q);

  return json({
    quizzes,
    q,
  });
}

const LibraryQuizPage = () => {
  const { quizzes, q } = useLoaderData<typeof loader>();

  const [query, setQuery] = useState(q || "");

  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  const submit = useSubmit();

  return (
    <PageContent>
      <PageContentHeader>
        <Form
          id="search-form"
          onChange={(event) => submit(event.currentTarget)}
          role="search"
          className="w-full"
        >
          <Input
            aria-label="Search Quizzes"
            defaultValue={q || ""}
            id="q"
            name="q"
            placeholder="Search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </Form>
        <Button asChild>
          <Link to={"/library/quizzes/create"}>Create Quiz</Link>
        </Button>
      </PageContentHeader>

      <QuizGrid>
        {quizzes.map((z) => (
          <QuizItemLibrary
            key={z.id}
            id={z.id}
            title={z.title}
            description={z.description}
            noOfRounds={z.noOfRounds}
            noOfQuestions={z.noOfQuestions}
            createdAt={z.createdAt}
            updatedAt={z.updatedAt}
            published={z.published}
            totalPoints={z.totalPoints}
          />
        ))}
      </QuizGrid>

      <Outlet />
    </PageContent>
  );
};

export default LibraryQuizPage;
