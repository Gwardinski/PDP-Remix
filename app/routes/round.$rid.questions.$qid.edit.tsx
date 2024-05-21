import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { json, useActionData, useLoaderData } from "@remix-run/react";
import { getValidatedFormData } from "remix-hook-form";
import { isAuthenticated } from "~/api/auth";
import { dbQuestionEdit, dbQuestionGet } from "~/api/question";
import {
  EditQuestionResolver,
  QuestionEditFormType,
  QuestionModalEdit,
} from "~/components/questions/modals";

const BASE_PATH = "/library/rounds";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const rid = Number(params.rid);
  const qid = Number(params.qid);
  if (!qid || !rid) {
    return redirect(BASE_PATH);
  }

  const question = await dbQuestionGet({ uid, qid });
  if (question?.uid !== uid) {
    return redirect(BASE_PATH);
  }

  return { question, rid };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // Validate Form Data
  const { receivedValues, errors, data } =
    await getValidatedFormData<QuestionEditFormType>(
      request,
      EditQuestionResolver,
    );
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const rid = Number(params.rid);
  const qid = Number(params.qid);
  if (!rid || !qid) {
    return redirect(BASE_PATH);
  }

  // Edit Question
  await dbQuestionEdit({
    ...data,
    uid: uid ?? 0,
  });

  return redirect(`/round/${rid}/questions`);
};

const RoundQuestionsEdit = () => {
  // TODO: ErrorHandling
  const actionRes = useActionData<typeof action>();
  const actionError = actionRes?.error ?? "";

  const loaderRes = useLoaderData<typeof loader>();
  const { question, rid } = loaderRes;

  return (
    <QuestionModalEdit
      question={question}
      actionError={actionError}
      basePath={`/round/${rid}/questions`}
    />
  );
};

export default RoundQuestionsEdit;
