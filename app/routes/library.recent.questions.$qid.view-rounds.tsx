import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import { dbRoundsGetFromQuestion } from "~/api/round";
import { QuestionModalViewRounds } from "~/components/questions/modals";

const BASE_PATH = "/library/recent";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const qid = Number(params.qid);
  if (!qid) {
    return redirect(BASE_PATH);
  }

  const r = new URL(request.url).searchParams.get("r") ?? "";
  const rounds = await dbRoundsGetFromQuestion({
    qid,
    query: r,
  });

  return { rounds, r };
};

const LibraryRecentQuestionsViewRounds = () => {
  const loaderRes = useLoaderData<typeof loader>();
  const { rounds, r } = loaderRes;

  return <QuestionModalViewRounds r={r} rounds={rounds} basePath={BASE_PATH} />;
};

export default LibraryRecentQuestionsViewRounds;
