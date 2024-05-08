import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import {
  dbQuizAddRound,
  dbQuizAddRoundGetQuizzes,
  dbQuizAddRoundGetRound,
} from "~/api/quiz";
import { RoundModalAddTo } from "~/components/rounds/modals/RoundModalAddTo";

const BASE_PATH = "/library/recent";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const rid = Number(params.id);
  if (!rid) {
    return redirect(BASE_PATH);
  }

  const round = await dbQuizAddRoundGetRound({ uid, rid });
  if (!round || round.uid !== uid) {
    return redirect(BASE_PATH);
  }

  const z = new URL(request.url).searchParams.get("z") ?? "";
  const currentZids = round.quizRounds.map((qr) => qr.zid) ?? [0];
  const quizzes = await dbQuizAddRoundGetQuizzes({
    uid,
    query: z,
    currentZids,
  });

  const noQuizzes = quizzes.length === 0 && !z;

  return { round, quizzes, z, noQuizzes };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // Add Question to Round
  const uid = await isAuthenticated(request);
  if (!uid) {
    return;
  }
  const rid = Number(params.id);
  if (!rid) {
    return redirect(BASE_PATH);
  }
  const formData = await request.formData();
  const selectedQuiz = formData.get("selectedQuiz");
  await dbQuizAddRound({
    uid,
    rid,
    zid: Number(selectedQuiz),
  });

  // Close Modal
  return redirect(BASE_PATH);
};

const LibraryRecentQuestionAddToPage = () => {
  // TODO: ErrorHandling
  const actionRes = useActionData<typeof action>();
  const loaderRes = useLoaderData<typeof loader>();
  const { round, quizzes, z, noQuizzes } = loaderRes;

  return (
    <RoundModalAddTo
      z={z}
      title={round.title}
      noQuizzes={noQuizzes}
      errorMessage={""}
      basePath={BASE_PATH}
      quizzes={quizzes}
    />
  );
};

export default LibraryRecentQuestionAddToPage;
