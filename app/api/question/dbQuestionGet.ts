import { db } from "../db";

export const dbQuestionGet = async ({
  uid,
  qid,
}: {
  uid: number;
  qid: number;
}) => {
  // Add user id and check for ownership / permissions / isPublished
  return await db.query.Question.findFirst({
    where: (question, { eq, or, and }) =>
      and(
        eq(question.id, qid),
        or(eq(question.uid, uid), eq(question.published, true)),
      ),
    with: {
      roundQuestions: {
        columns: {
          rid: true,
        },
      },
    },
  });
};

export const dbQuestionsGetRecent = async (uid: number) => {
  return await db.query.Question.findMany({
    where: (question, { eq }) => eq(question.uid, uid),
    orderBy: (question, { desc }) => [desc(question.updatedAt)],
    limit: 6,
    with: {
      roundQuestions: {
        columns: {
          rid: true,
        },
      },
    },
  });
};

export const dbQuestionsGetUsers = async (uid: number, query: string = "") => {
  return await db.query.Question.findMany({
    where: (question, { eq, ilike, and }) =>
      and(eq(question.uid, uid), ilike(question.title, `%${query}%`)),
    orderBy: (question, { desc }) => [desc(question.updatedAt)],
    limit: 6,
    with: {
      roundQuestions: {
        columns: {
          rid: true,
        },
      },
    },
  });
};

export const dbQuestionGetForRound = async (
  uid: number,
  rid: number,
  query: string = "",
) => {
  const questions = await db.query.Question.findMany({
    with: {
      roundQuestions: true,
    },
    where: (questions, { and, eq, ne, ilike }) => {
      return and(
        eq(questions.uid, uid),
        ne(questions.published, true),
        ilike(questions.title, `%${query}%`),
      );
    },
  });
  // TODO: how do I do this as part of the request?
  return questions.filter((quiz) => {
    return quiz.roundQuestions.every((rq) => rq.rid !== rid);
  });
};
