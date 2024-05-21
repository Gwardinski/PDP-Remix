import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { json, useActionData, useLoaderData } from "@remix-run/react";
import { getValidatedFormData } from "remix-hook-form";
import { isAuthenticated } from "~/api/auth";
import { dbQuizCreate } from "~/api/quiz";
import {
  QuizCreateFormType,
  QuizModalCreate,
  createQuizResolver,
} from "~/components/quizzes/modals";

const BASE_PATH = "/library/rounds";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const rid = Number(params.rid);
  return { rid };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // Validate Form Data
  const { receivedValues, errors, data } =
    await getValidatedFormData<QuizCreateFormType>(request, createQuizResolver);
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

  await dbQuizCreate({
    ...data,
    rid,
    uid,
  });

  // Close Modal
  return redirect(`/round/${rid}/quizzes`);
};

const LibraryQuizzesCreate = () => {
  const loaderRes = useLoaderData<typeof loader>();
  const actionRes = useActionData<typeof action>();
  const actionError = actionRes?.error ?? "";
  const { rid } = loaderRes;

  return (
    <QuizModalCreate
      basePath={`/round/${rid}/quizzes`}
      actionError={actionError}
    />
  );
};

export default LibraryQuizzesCreate;
