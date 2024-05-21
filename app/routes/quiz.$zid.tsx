import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { Pencil, Trash2, Upload } from "lucide-react";
import { isAuthenticated } from "~/api/auth";
import { dbQuizGet } from "~/api/quiz";
import { Page, PageHeader, useIsPending } from "~/components/layout";
import { Button, H1 } from "~/components/ui";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const zid = Number(params.zid);
  if (!zid) {
    return redirect("/library/rounds");
  }
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }

  const quiz = await dbQuizGet({ zid, uid });
  if (!quiz) {
    return redirect("/library/quizzes");
  }

  return { quiz };
};

export default function QuizPage() {
  const loaderRes = useLoaderData<typeof loader>();
  const { quiz } = loaderRes;

  const { isPending } = useIsPending();

  return (
    <Page>
      <PageHeader className="flex flex-col lg:flex-row">
        <div className="flex w-full flex-col gap-4">
          <H1 className="w-full">{quiz.title}</H1>
          <small className="flex gap-1 text-sm text-zinc-600 dark:text-zinc-400 lg:w-fit">
            <p className="pr-2 text-sm text-orange-500 dark:text-orange-600">
              Quiz
            </p>
            Created:{" "}
            <time className="w-fit pr-2">
              {format(quiz.createdAt, "dd/MM/yyyy")}
            </time>
            Last Updated:{" "}
            <time className="w-fit">
              {format(quiz.updatedAt, "dd/MM/yyyy")}
            </time>
          </small>
          {quiz.description && (
            <p className="text-sm text-zinc-800 dark:text-zinc-200">
              {quiz.description}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {!quiz.published && (
            <>
              <Button
                asChild
                disabled={isPending}
                variant="outline"
                className="w-full lg:w-fit"
              >
                <Link to={`/quiz/${quiz.id}/edit-details`}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
              <Button
                asChild
                disabled={isPending}
                variant="outline"
                className="w-full lg:w-fit"
              >
                <Link to={`/quiz/${quiz.id}/publish`}>
                  <Upload className="mr-2 h-4 w-4" /> Publish
                </Link>
              </Button>
              <Button
                asChild
                disabled={isPending}
                variant="destructive"
                className="w-full lg:w-fit"
              >
                <Link to={`/quiz/${quiz.id}/delete`}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Link>
              </Button>
            </>
          )}
        </div>
      </PageHeader>

      <Outlet />
    </Page>
  );
}
