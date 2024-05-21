import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { format } from "date-fns";
import { Pencil, Trash2, Upload } from "lucide-react";
import { isAuthenticated } from "~/api/auth";
import { dbRoundGet } from "~/api/round";
import { Page, PageHeader, useIsPending } from "~/components/layout";
import { Button, H1, Tabs, TabsList, TabsTrigger } from "~/components/ui";

export type RoundLoaderType = typeof loader;
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const rid = Number(params.rid);
  if (!rid) {
    return redirect("/library/rounds");
  }
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }

  const round = await dbRoundGet({ rid, uid });
  if (!round) {
    return redirect("/library/rounds");
  }

  return json({
    round,
  });
};

const RoundPage = () => {
  const loaderRes = useLoaderData<RoundLoaderType>();
  const { round } = loaderRes;

  const { isPending } = useIsPending();

  const pathname = useLocation().pathname.split("/")[3] ?? "";

  if (!round) {
    return null;
  }

  return (
    <Page>
      <PageHeader className="grid grid-cols-1 gap-4">
        <div className="col-span-2 flex w-full flex-col gap-4 lg:col-span-1">
          <H1 className="w-full">{round.title}</H1>
          <small className="flex min-w-fit gap-1 text-sm text-zinc-600 dark:text-zinc-400 lg:w-fit">
            <p className="pr-2 text-sm text-orange-500 dark:text-orange-600">
              Round
            </p>
            Created:{" "}
            <time className="w-fit pr-2">
              {format(round.createdAt, "dd/MM/yyyy")}
            </time>
            Updated:{" "}
            <time className="w-fit">
              {format(round.updatedAt, "dd/MM/yyyy")}
            </time>
          </small>
          {round.description && (
            <p className="text-sm text-zinc-800 dark:text-zinc-200">
              {round.description}
            </p>
          )}
        </div>

        <div className="col-span-2 flex gap-2 lg:col-span-1">
          {!round.published && (
            <>
              <Button
                asChild
                disabled={isPending}
                variant="outline"
                className="w-full lg:w-fit"
              >
                <Link to={`/round/${round.id}/edit-details`}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
              <Button
                asChild
                disabled={isPending}
                variant="outline"
                className="w-full lg:w-fit"
              >
                <Link to={`/round/${round.id}/publish`}>
                  <Upload className="mr-2 h-4 w-4" /> Publish
                </Link>
              </Button>
              <Button
                asChild
                disabled={isPending}
                variant="destructive"
                className="w-full lg:w-fit"
              >
                <Link to={`/round/${round.id}/delete`}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Link>
              </Button>
            </>
          )}
        </div>

        <nav className="col-span-2 flex w-full flex-col gap-2">
          <Tabs value={pathname}>
            <TabsList>
              <TabsTrigger value="questions" asChild>
                <Link to={`/round/${round.id}/questions`}>
                  {round.noOfQuestions ?? 0} Questions
                </Link>
              </TabsTrigger>
              <TabsTrigger value="quizzes" asChild>
                <Link to={`/round/${round.id}/quizzes`}>
                  Used in {round.noOfQuizzes ?? 0} Quizzes
                </Link>
              </TabsTrigger>
              <TabsTrigger value="quizzes-add-to" asChild>
                <Link to={`/round/${round.id}/quizzes-add-to`}>
                  Add to Quiz
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </nav>
      </PageHeader>

      <Outlet />
    </Page>
  );
};

export default RoundPage;
