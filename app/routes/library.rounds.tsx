import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  MetaFunction,
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { isAuthenticated } from "~/api/auth";
import { dbRoundsGetLibrary } from "~/api/round";
import { PageContent, PageContentHeader } from "~/components/layout";
import { RoundGrid, RoundItemLibrary } from "~/components/rounds";
import { Button, Input } from "~/components/ui";

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
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const q = new URL(request.url).searchParams.get("q") ?? "";

  const rounds = await dbRoundsGetLibrary(uid, q);

  return {
    rounds,
    q,
  };
}

const LibraryRoundPage = () => {
  const { rounds, q } = useLoaderData<typeof loader>();
  const { state } = useNavigation();
  const isPending = Boolean(state === "loading");

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
            aria-label="Search Rounds"
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
          <Link to={"/library/rounds/create"}>Create Round</Link>
        </Button>
      </PageContentHeader>

      <RoundGrid>
        {rounds.map((r) => (
          <RoundItemLibrary
            key={r.id}
            id={r.id}
            title={r.title}
            description={r.description}
            createdAt={r.createdAt}
            updatedAt={r.updatedAt}
            noOfQuestions={r.noOfQuestions}
            noOfQuizzes={r.noOfQuizzes}
            published={r.published}
            isPending={isPending}
          />
        ))}
      </RoundGrid>

      <Outlet />
    </PageContent>
  );
};

export default LibraryRoundPage;