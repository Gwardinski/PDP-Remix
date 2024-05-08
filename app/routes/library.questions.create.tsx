import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { getValidatedFormData } from "remix-hook-form";
import { isAuthenticated } from "~/api/auth";
import { dbQuestionCreate } from "~/api/question";
import {
  QuestionCreateFormType,
  QuestionModalCreate,
  createQuestionResolver,
} from "~/components/questions/modals";

const BASE_PATH = "/library/questions";

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
    await getValidatedFormData<QuestionCreateFormType>(
      request,
      createQuestionResolver,
    );
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  // Create Question
  const uid = await isAuthenticated(request);
  await dbQuestionCreate({
    ...data,
    uid: uid ?? 0,
  });

  return redirect(BASE_PATH);
};

const QuestionCreatePage = () => {
  const actionRes = useActionData<typeof action>();
  const actionError = actionRes?.error ?? "";

  return (
    <QuestionModalCreate redirectPath={BASE_PATH} actionError={actionError} />
  );
};

export default QuestionCreatePage;
