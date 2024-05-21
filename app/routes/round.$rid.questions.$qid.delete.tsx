import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import { dbQuestionDelete, dbQuestionGet } from "~/api/question";
import { QuestionModalDelete } from "~/components/questions/modals";

const BASE_PATH = "/library/questions";

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

  const question = await dbQuestionGet({ uid, qid });
  if (question?.uid !== uid) {
    return redirect(BASE_PATH);
  }

  return { question, rid };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect(BASE_PATH);
  }
  const rid = Number(params.qid);
  if (!rid) {
    return redirect(BASE_PATH);
  }

  // Delete Question
  const formData = await request.formData();
  const selectedQuestion = formData.get("selectedQuestion");
  await dbQuestionDelete({
    uid,
    qid: Number(selectedQuestion),
  });

  return redirect(`/round/${rid}/questions`);
};

const RoundQuestionDelete = () => {
  // TODO: ErrorHandling
  // const actionRes = useActionData<typeof action>();
  const loaderRes = useLoaderData<typeof loader>();
  const { question, rid } = loaderRes;

  return (
    <QuestionModalDelete
      qid={question.id}
      title={question.title}
      errorMessage={""}
      basePath={`/round/${rid}/questions`}
    />
  );
};

export default RoundQuestionDelete;
