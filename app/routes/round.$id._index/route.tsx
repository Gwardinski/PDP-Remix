import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useRouteLoaderData,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  RemixFormProvider,
  getValidatedFormData,
  useRemixForm,
} from "remix-hook-form";
import { z } from "zod";
import { isAuthenticated } from "~/api/auth";
import { dbQuestionGetForRound } from "~/api/question";
import { NoContentContainer } from "~/components/NoContentContainer";
import { PageSection, PageSectionList } from "~/components/layout";
import {
  QuestionItemRound,
  QuestionItemRoundAddTo,
} from "~/components/questions";
import { Accordion, Button, H2, Input } from "~/components/ui";
import { RoundLoaderType } from "../round.$id/route";

const formSchema = z.object({
  rid: z.number(),
  qid: z.number(),
});
const resolver = zodResolver(formSchema);
type QuestionAddToFormType = z.infer<typeof formSchema>;

export const action = async ({ request }: ActionFunctionArgs) => {
  const { receivedValues, errors, data } =
    await getValidatedFormData<QuestionAddToFormType>(request, resolver);
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  const uid = await isAuthenticated(request);
  if (!uid) {
    return;
  }

  const body = {
    uid,
    ...data,
  };
  // await dbRoundAddChild(body);

  return true;
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const rid = Number(params.id);
  if (!rid) {
    return redirect("/library/rounds");
  }
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }

  const q = new URL(request.url).searchParams.get("q") ?? "";

  const questions = await dbQuestionGetForRound(uid, rid, q);

  return json({
    questions,
    q,
  });
}

const RoundPageIndex = () => {
  const parentRes = useRouteLoaderData<RoundLoaderType>("routes/round.$id");
  const loaderRes = useLoaderData<typeof loader>();

  const round = parentRes?.round;
  const { questions, q } = loaderRes;

  const [query, setQuery] = useState(q || "");

  const form = useRemixForm<QuestionAddToFormType>({
    resolver,
    defaultValues: {
      rid: round?.id,
    },
  });

  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  const submit = useSubmit();

  if (!round) {
    return null;
  }

  const hasQuestions = round.roundQuestions.length > 0;
  const hasLibraryQuestions = (Boolean(questions.length) && !q) || q;

  return (
    <PageSectionList className="flex-col lg:flex-row">
      <PageSection>
        {hasQuestions && (
          <Accordion type="multiple" className="border-t border-zinc-900">
            {round.roundQuestions.map(({ question }, i) => (
              <QuestionItemRound
                key={question.id}
                i={i + 1}
                id={question.id}
                title={question.title}
                answer={question.answer}
                category={question.category}
                points={question.points}
                createdAt={question.createdAt}
                updatedAt={question.updatedAt}
              />
            ))}
          </Accordion>
        )}

        {!hasQuestions && (
          <NoContentContainer className="h-20">
            <p>
              Click <i>Create Question</i> to get started, or search from your
              Library
            </p>
          </NoContentContainer>
        )}

        {!round.published && (
          <Button
            asChild
            variant="secondary"
            className="w-full lg:ml-auto lg:w-fit"
          >
            <Link to={`/round/${round.id}/create-question`}>
              Create Question
            </Link>
          </Button>
        )}
      </PageSection>

      {!round.published && hasLibraryQuestions && (
        <PageSection>
          <header className="flex h-20 flex-col justify-between gap-2">
            <H2 className="text-xl">Add Questions From Library</H2>
            <Form
              id="search-form"
              onChange={(event) => submit(event.currentTarget)}
              role="search"
            >
              <Input
                aria-label="Search Questions"
                defaultValue={q || ""}
                id="q"
                name="q"
                placeholder="Search your Library..."
                type="search"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
              />
            </Form>
          </header>

          <Form method="post" onSubmit={form.handleSubmit}>
            <RemixFormProvider {...form}>
              <Accordion type="multiple">
                {questions.map((q) => (
                  <QuestionItemRoundAddTo
                    key={q.id}
                    onAddQuestion={() => form.setValue("qid", q.id)}
                    type={form.formState.isSubmitting ? "button" : "submit"}
                    disabled={form.formState.isSubmitting}
                    qid={q.id}
                    title={q.title}
                    answer={q.answer}
                    category={q.category}
                    points={q.points}
                    createdAt={q.createdAt}
                    updatedAt={q.updatedAt}
                  />
                ))}
              </Accordion>
            </RemixFormProvider>
          </Form>
        </PageSection>
      )}
    </PageSectionList>
  );
};

export default RoundPageIndex;
