import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import { dbQuestionGet, dbQuestionPublish } from "~/api/question";
import { QuestionModalPublish } from "~/components/questions/modals";

const BASE_PATH = "/library/questions";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const qid = Number(params.id);
  if (!qid) {
    return redirect(BASE_PATH);
  }
  const question = await dbQuestionGet({ uid, qid });
  if (question?.uid !== uid) {
    return redirect(BASE_PATH);
  }
  return { question };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect(BASE_PATH);
  }
  const rid = Number(params.id);
  if (!rid) {
    return redirect(BASE_PATH);
  }

  // Delete Question
  const formData = await request.formData();
  const selectedQuestion = formData.get("selectedQuestion");
  await dbQuestionPublish({
    uid,
    qid: Number(selectedQuestion),
  });

  return redirect(BASE_PATH);
};

const LibraryQuestionPublishPage = () => {
  // TODO: ErrorHandling
  // const actionRes = useActionData<typeof action>();
  const loaderRes = useLoaderData<typeof loader>();
  const { question } = loaderRes;

  return (
    <QuestionModalPublish
      qid={question.id}
      title={question.title}
      errorMessage={""}
      basePath={""}
    />
  );
};

export default LibraryQuestionPublishPage;
