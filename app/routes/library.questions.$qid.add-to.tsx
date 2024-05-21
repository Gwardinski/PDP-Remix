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

const BASE_PATH = "/library/questions";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const qid = Number(params.qid);
  if (!qid) {
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

  return { question, rounds, r, noRounds };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // Add Question to Round
  const uid = await isAuthenticated(request);
  if (!uid) {
    return;
  }
  const qid = Number(params.qid);
  if (!qid) {
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
  return redirect(BASE_PATH);
};

const LibraryQuestionsAddTo = () => {
  // TODO: ErrorHandling
  const actionRes = useActionData<typeof action>();
  const loaderRes = useLoaderData<typeof loader>();
  const { question, rounds, r, noRounds } = loaderRes;

  return (
    <QuestionModalAddTo
      r={r}
      title={question.title}
      noRounds={noRounds}
      errorMessage={""}
      basePath={BASE_PATH}
      rounds={rounds}
    />
  );
};

export default LibraryQuestionsAddTo;
