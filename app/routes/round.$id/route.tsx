import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigation,
} from "@remix-run/react";
import { format } from "date-fns";
import { Pencil, Trash2, Upload } from "lucide-react";
import { isAuthenticated, isAuthorisedToView } from "~/api/auth";
import { dbRoundGet } from "~/api/round";
import { Page, PageHeader } from "~/components/layout";
import { Button, H1, Tabs, TabsList, TabsTrigger } from "~/components/ui";

export type RoundLoaderType = typeof loader;
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const rid = Number(params.id);
  if (!rid) {
    return redirect("/library/rounds");
  }
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const round = await dbRoundGet(rid);
  if (!isAuthorisedToView(round?.uid, uid)) {
    return redirect("/library/rounds");
  }

  return json({
    round,
  });
};

const RoundPage = () => {
  const loaderRes = useLoaderData<RoundLoaderType>();
  const { round } = loaderRes;

  const { state } = useNavigation();
  const isPending = Boolean(state === "loading");

  const pathname = useLocation().pathname.split("/")[3] ?? "";

  if (!round) {
    return null;
  }

  return (
    <Page>
      <PageHeader className="grid grid-cols-1 gap-4">
        <div className="col-span-2 flex w-full flex-col gap-4 lg:col-span-1">
          <small className="-mb-4 text-sm text-orange-500 dark:text-orange-600">
            Round
          </small>
          <H1 className="w-full">{round.title}</H1>
          <p className="flex gap-1 text-sm text-zinc-600 dark:text-zinc-400 lg:w-fit">
            Created:{" "}
            <time className="w-fit pr-3">
              {format(round.createdAt, "dd/MM/yyyy")}
            </time>
            Last Updated:{" "}
            <time className="w-fit">
              {format(round.updatedAt, "dd/MM/yyyy")}
            </time>
          </p>
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
              <TabsTrigger value="" asChild>
                <Link to={`/round/${round.id}`}>
                  {round.noOfQuestions ?? 0} Questions
                </Link>
              </TabsTrigger>
              <TabsTrigger value="quizzes" asChild>
                <Link to={`/round/${round.id}/quizzes`}>
                  Used in {round.noOfQuizzes ?? 0} Quizzes
                </Link>
              </TabsTrigger>
              <TabsTrigger value="add-to-quiz" asChild>
                <Link to={`/round/${round.id}/add-to-quiz`}>Add to Quiz</Link>
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
