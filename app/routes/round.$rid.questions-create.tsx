import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { json, useActionData, useLoaderData } from "@remix-run/react";
import { getValidatedFormData } from "remix-hook-form";
import { isAuthenticated } from "~/api/auth";
import { dbQuestionCreateAsChild } from "~/api/question";
import {
  QuestionCreateFormType,
  QuestionModalCreate,
  createQuestionResolver,
} from "~/components/questions/modals";

const BASE_PATH = "/library/rounds";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const rid = Number(params.rid);
  if (!rid) {
    return redirect(BASE_PATH);
  }
  return {
    rid,
  };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // Validate Form Data
  const { receivedValues, errors, data } =
    await getValidatedFormData<QuestionCreateFormType>(
      request,
      createQuestionResolver,
    );
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  // Create Question
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect(BASE_PATH);
  }
  const rid = Number(params.rid);
  if (!rid) {
    return redirect(BASE_PATH);
  }
  await dbQuestionCreateAsChild({
    ...data,
    uid,
    rid,
  });

  return redirect(`/round/${rid}/questions`);
};

const RoundQuestionsCreate = () => {
  const loaderRes = useLoaderData<typeof loader>();
  const { rid } = loaderRes;
  const actionRes = useActionData<typeof action>();
  const actionError = actionRes?.error ?? "";

  return (
    <QuestionModalCreate
      basePath={`/round/${rid}/questions`}
      actionError={actionError}
    />
  );
};

export default RoundQuestionsCreate;
