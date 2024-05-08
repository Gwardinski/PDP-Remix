import { db } from "../db";
import { roundToQuestion } from "../schema";

// Get selected Question, and ids for any Rounds it has already been added to
type RoundAddQuestionGetQuestionProps = {
  uid: number;
  qid: number;
};
export const dbRoundAddQuestionGetQuestion = async ({
  uid,
  qid,
}: RoundAddQuestionGetQuestionProps) => {
  return await db.query.Question.findFirst({
    where: (question, { and, eq }) =>
      and(eq(question.id, qid), eq(question.uid, uid)),
    with: {
      roundQuestions: true,
    },
  });
};

// Gets list of users Rounds, filtered by any rids the Question is already part of
type RoundAddQuestionGetRoundsProps = {
  uid: number;
  query: string;
  currentRids: number[];
};
export const dbRoundAddQuestionGetRounds = async ({
  uid,
  query,
  currentRids,
}: RoundAddQuestionGetRoundsProps) => {
  const rounds = await db.query.Round.findMany({
    where: (round, { eq, ilike, and, notInArray }) => {
      if (currentRids.length === 0) {
        return and(
          eq(round.uid, uid),
          eq(round.published, false),
          ilike(round.title, `%${query}%`),
        );
      }
      return and(
        eq(round.uid, uid),
        eq(round.published, false),
        ilike(round.title, `%${query}%`),
        notInArray(round.id, currentRids),
      );
    },
    columns: {
      id: true,
      uid: true,
      title: true,
    },
    with: {
      quizRounds: true,
      roundQuestions: true,
    },
  });

  return rounds.map((round) => {
    return {
      id: round.id,
      uid: round.uid,
      title: round.title,
      noOfQuestions: round.roundQuestions.length,
      noOfQuizzes: round.quizRounds.length,
    };
  });
};

// Adds a Question to a Round
type RoundAddQuestionProps = {
  uid: number;
  rid: number;
  qid: number;
};
export const dbRoundAddQuestion = async ({
  uid,
  rid,
  qid,
}: RoundAddQuestionProps) => {
  await db.transaction(async (tx) => {
    // Check Question exists and is either owned or published
    const question = await db.query.Question.findFirst({
      where: (question, { and, eq, or }) =>
        and(
          eq(question.id, qid),
          or(eq(question.uid, uid), eq(question.published, true)),
        ),
    });
    if (!question) {
      return false;
    }

    // Check Round exists and is owned
    const round = await db.query.Round.findFirst({
      where: (round, { and, eq }) => and(eq(round.id, rid), eq(round.uid, uid)),
    });
    if (!round) {
      return false;
    }

    // Create link between Round and Question
    await tx.insert(roundToQuestion).values({ rid: rid, qid: qid });
  });

  return true;
};
