import { db } from "../db";

// /edit, /delete, /publish
export const dbQuestionGet = async ({
  uid,
  qid,
}: {
  uid: number;
  qid: number;
}) => {
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

// /library, /profile
export const dbQuestionsGetUsers = async (uid: number, query: string = "") => {
  return await db.query.Question.findMany({
    where: (question, { eq, ilike, and }) =>
      and(eq(question.uid, uid), ilike(question.title, `%${query}%`)),
    orderBy: (question, { desc }) => [desc(question.updatedAt)],
    with: {
      roundQuestions: {
        columns: {
          rid: true,
        },
      },
    },
  });
};

// /recent
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
