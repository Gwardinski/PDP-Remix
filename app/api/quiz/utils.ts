export function formatQuizApiResponse(quiz: {
  uid: number;
  id: number;
  title: string;
  description: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  quizRounds: {
    round: {
      uid: number;
      id: number;
      title: string;
      description: string;
      published: boolean;
      createdAt: string;
      updatedAt: string;
      roundQuestions: {
        question: {
          uid: number;
          id: number;
          createdAt: string;
          updatedAt: string;
          title: string;
          answer: string;
          points: number;
          category: string;
          published: boolean;
        };
      }[];
    };
  }[];
}) {
  return {
    id: quiz.id,
    uid: quiz.uid,
    title: quiz.title,
    description: quiz.description,
    published: quiz.published,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
    noOfRounds: quiz.quizRounds.length,
    noOfQuestions: quiz.quizRounds.reduce((accumulator, quizRound) => {
      return (
        accumulator +
        quizRound.round.roundQuestions.reduce(
          (roundAccumulator, roundQuestion) => {
            return roundAccumulator + roundQuestion.question.points;
          },
          0,
        )
      );
    }, 0),
    totalPoints: quiz.quizRounds.reduce((accumulator, quizRound) => {
      return (
        accumulator +
        quizRound.round.roundQuestions.reduce(
          (roundAccumulator, roundQuestion) => {
            return roundAccumulator + roundQuestion.question.points;
          },
          0,
        )
      );
    }, 0),
  };
}

export function formatQuizzesApiResponse(
  quizzes: {
    id: number;
    createdAt: string;
    updatedAt: string;
    uid: number;
    title: string;
    published: boolean;
    description: string | null;
    quizRounds: {
      round: {
        id: number;
        roundQuestions: {
          question: {
            id: number;
            points: number;
          };
        }[];
      };
    }[];
  }[],
) {
  return quizzes.map((quiz) => {
    return {
      zid: quiz.id,
      uid: quiz.uid,
      title: quiz.title,
      description: quiz.description,
      published: quiz.published,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      noOfRounds: quiz.quizRounds.length,
      noOfQuestions: quiz.quizRounds.reduce((accumulator, quizRound) => {
        return (
          accumulator +
          quizRound.round.roundQuestions.reduce(
            (roundAccumulator, roundQuestion) => {
              return roundAccumulator + roundQuestion.question.points;
            },
            0,
          )
        );
      }, 0),
      totalPoints: quiz.quizRounds.reduce((accumulator, quizRound) => {
        return (
          accumulator +
          quizRound.round.roundQuestions.reduce(
            (roundAccumulator, roundQuestion) => {
              return roundAccumulator + roundQuestion.question.points;
            },
            0,
          )
        );
      }, 0),
    };
  });
}
