import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import { dbQuizGet } from "~/api/quiz";
import { Page, PageHeader } from "~/components/layout";
import { H1, H4 } from "~/components/ui";
import QuizEditor from "./editor";

export const meta: MetaFunction = () => {
  return [
    { title: "Quiz" },
    {
      name: "Quiz",
      content: "Quiz",
    },
  ];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  // Auth Check
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  // Get Initial Data
  const zid = Number(params.id);
  if (!zid) {
    return redirect("/library/quizzes");
  }
  const quiz = await dbQuizGet(zid);
  // Permissions Check
  if (quiz?.uid !== uid) {
    return redirect("/library/quizzes");
  }

  return { quiz };
};

export default function QuizPage() {
  const loaderRes = useLoaderData<typeof loader>();
  const { quiz } = loaderRes;

  console.log("quiz", quiz);

  return (
    <Page>
      <PageHeader>
        <H1>{quiz?.title}</H1>
        <H4>{quiz?.description}</H4>
      </PageHeader>

      <div className="flex w-full flex-col gap-16">
        <QuizEditor />
        {/* <QuizEditorLibrary /> */}
      </div>
      <Outlet />
    </Page>
  );
}
