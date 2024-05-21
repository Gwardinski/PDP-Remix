import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { json, useActionData } from "@remix-run/react";
import { getValidatedFormData } from "remix-hook-form";
import { isAuthenticated } from "~/api/auth";
import { dbQuizCreate } from "~/api/quiz";
import {
  QuizCreateFormType,
  QuizModalCreate,
  createQuizResolver,
} from "~/components/quizzes/modals";

const BASE_PATH = "/library/quizzes";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  return true;
};

export const action = async ({ request }: ActionFunctionArgs) => {
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
  await dbQuizCreate({
    ...data,
    uid,
  });

  // Close Modal
  return redirect("/library/quizzes");
};

const LibraryQuizzesCreate = () => {
  const actionRes = useActionData<typeof action>();
  const actionError = actionRes?.error ?? "";

  return <QuizModalCreate basePath={BASE_PATH} actionError={actionError} />;
};

export default LibraryQuizzesCreate;
