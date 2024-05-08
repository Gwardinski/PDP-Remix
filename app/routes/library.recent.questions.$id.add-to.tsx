import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { json, useActionData, useLoaderData } from "@remix-run/react";
import { getValidatedFormData } from "remix-hook-form";
import { z } from "zod";
import { isAuthenticated } from "~/api/auth";
import {
  dbRoundAddQuestion,
  dbRoundAddQuestionGetQuestion,
  dbRoundAddQuestionGetRounds,
} from "~/api/round";
import { QuestionModalAddTo } from "~/components/questions/modals";

const BASE_PATH = "/library/recent";

const formSchema = z.object({
  rid: z.number(),
  qid: z.number(),
});
const resolver = zodResolver(formSchema);
type QuestionAddToFormType = z.infer<typeof formSchema>;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const qid = Number(params.id);
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

export const action = async ({ request }: ActionFunctionArgs) => {
  // Validate Form Data
  const { receivedValues, errors, data } =
    await getValidatedFormData<QuestionAddToFormType>(request, resolver);
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  // Add Question to Round
  const uid = await isAuthenticated(request);
  if (!uid) {
    return;
  }
  await dbRoundAddQuestion({ ...data, uid });

  // Close Modal
  return redirect(BASE_PATH);
};

const LibraryRecentQuestionAddToPage = () => {
  // TODO: ErrorHandling
  const actionRes = useActionData<typeof action>();
  const loaderRes = useLoaderData<typeof loader>();
  const { question, rounds, r, noRounds } = loaderRes;

  return (
    <QuestionModalAddTo
      r={r}
      qid={question.id}
      title={question.title}
      noRounds={noRounds}
      errorMessage={""}
      basePath={BASE_PATH}
      rounds={rounds}
    />
  );
};

export default LibraryRecentQuestionAddToPage;
