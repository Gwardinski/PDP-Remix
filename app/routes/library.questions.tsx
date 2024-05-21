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
import { dbQuestionsGetUsers } from "~/api/question";
import { PageContent, PageContentHeader } from "~/components/layout";
import { QuestionItemLibrary } from "~/components/questions";
import { Accordion, Button, Input } from "~/components/ui";

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

  const q = new URL(request.url).searchParams.get("q") ?? "";

  const questions = await dbQuestionsGetUsers(uid, q);

  return json({
    questions,
    q,
  });
}

const LibraryQuestion = () => {
  const { questions, q } = useLoaderData<typeof loader>();

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
            aria-label="Search Questions"
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
          <Link to={"/library/questions/create"}>Create Question</Link>
        </Button>
      </PageContentHeader>

      <Accordion type="multiple">
        {questions.map((q) => (
          <QuestionItemLibrary
            key={q.id}
            id={q.id}
            title={q.title}
            answer={q.answer}
            category={q.category}
            noOfRounds={q.roundQuestions.length}
            points={q.points}
            published={q.published}
            createdAt={q.createdAt}
            updatedAt={q.updatedAt}
            editPath={`/library/questions/${q.id}/edit`}
            publishPath={`/library/questions/${q.id}/publish`}
            deletePath={`/library/questions/${q.id}/delete`}
            addToPath={`/library/questions/${q.id}/add-to`}
            viewRoundsPath={`/library/questions/${q.id}/view-rounds`}
          />
        ))}
      </Accordion>

      <Outlet />
    </PageContent>
  );
};

export default LibraryQuestion;
