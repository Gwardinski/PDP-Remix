import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import {
  dbRoundAddQuestion,
  dbRoundAddQuestionGetQuestion,
  dbRoundAddQuestionGetRounds,
} from "~/api/round";
import { QuestionModalAddTo } from "~/components/questions/modals";

const BASE_PATH = "/library/rounds";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const rid = Number(params.rid);
  const qid = Number(params.qid);
  if (!rid || !qid) {
    return redirect(BASE_PATH);
  }

  const question = await dbRoundAddQuestionGetQuestion({ uid, qid });
  if (!question || question.uid !== uid) {
    return redirect(BASE_PATH);
  }

  const r = new URL(request.url).searchParams.get("r") ?? "";
  const currentRids = question.roundQuestions.map((rq) => rq.rid) ?? [0];
  const rounds = await dbRoundAddQuestionGetRounds({
    uid,
    query: r,
    currentRids,
  });

  const noRounds = rounds.length === 0 && !r;

  return { question, rounds, r, noRounds, rid };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const rid = Number(params.rid);
  const qid = Number(params.qid);
  if (!rid || !qid) {
    return redirect(BASE_PATH);
  }

  const formData = await request.formData();
  const selectedRound = formData.get("selectedRound");
  await dbRoundAddQuestion({
    uid,
    qid,
    rid: Number(selectedRound),
  });

  // Close Modal
  return redirect(`/round/${rid}/questions`);
};

const RoundQuestionsAddTo = () => {
  // TODO: ErrorHandling
  const actionRes = useActionData<typeof action>();
  const loaderRes = useLoaderData<typeof loader>();
  const { question, rounds, r, noRounds, rid } = loaderRes;

  return (
    <QuestionModalAddTo
      r={r}
      title={question.title}
      noRounds={noRounds}
      errorMessage={""}
      basePath={`/round/${rid}/questions`}
      rounds={rounds}
    />
  );
};

export default RoundQuestionsAddTo;
