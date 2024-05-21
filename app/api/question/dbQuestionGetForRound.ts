import { db } from "../db";

// /round/rid/questions (add to)
export const dbQuestionGetForRound = async ({
  uid,
  rid,
  query = "",
}: {
  uid: number;
  rid: number;
  query: string;
}) => {
  const questions = await db.query.Question.findMany({
    with: {
      roundQuestions: true,
    },
    where: (questions, { and, eq, ilike }) => {
      return and(eq(questions.uid, uid), ilike(questions.title, `%${query}%`));
    },
  });

  // how do I do this as part of the request?
  const filteredQuestions = questions.filter((quiz) => {
    return quiz.roundQuestions.every((rq) => rq.rid !== rid);
  });

  return filteredQuestions.map((q) => {
    return {
      qid: q.id,
      title: q.title,
      answer: q.answer,
      category: q.category,
      points: q.points,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      published: q.published,
      noOfRounds: q.roundQuestions.length,
    };
  });
};
