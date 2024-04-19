import { Accordion } from "@radix-ui/react-accordion";
import {
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui";
import { useLibraryStore, useQuizStore } from "./_state";
import { QuestionItem } from "./components/_questionItem";
import { RoundItem } from "./components/_roundItem";

export default function QuizEditorLibrary() {
  return (
    <div className="flex h-full w-full max-w-xl flex-col gap-4 ">
      <h2 className="text-xl">Add Content From Your Library</h2>
      <Tabs defaultValue="library_questions">
        <TabsList className="mb-2">
          <TabsTrigger value="library_questions">Questions</TabsTrigger>
          <TabsTrigger value="library_rounds">Rounds</TabsTrigger>
        </TabsList>
        <TabsContent value="library_questions">
          <QuestionsLibrary />
        </TabsContent>
        <TabsContent value="library_rounds">
          <RoundsLibrary />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const QuestionsLibrary = () => {
  const libraryQuestions = useLibraryStore((state) => state.libraryQuestions);
  const getLibraryQuestions = useLibraryStore(
    (state) => state.getLibraryQuestions,
  );
  const quizRounds = useQuizStore((state) => state.rounds);
  const quizQuestions = useQuizStore((state) => state.questions);
  const onAddQuestionToRound = useQuizStore(
    (state) => state.onAddQuestionToRound,
  );

  const questions = getLibraryQuestions(
    quizQuestions.map((q) => q.id.toString()),
  );

  return (
    <div className="flex flex-col gap-2">
      <Input placeholder="Search your Questions..." />
      <h4 className="min-w-fit self-end text-xs">
        Showing {questions.length} of {libraryQuestions.length}
      </h4>
      <Accordion type="multiple">
        <div className="flex flex-col gap-2">
          {questions.map((q, i) => (
            <QuestionItem
              key={q.id}
              question={q}
              rounds={quizRounds}
              onAddToRound={onAddQuestionToRound}
            />
          ))}
        </div>
      </Accordion>
    </div>
  );
};

const RoundsLibrary = () => {
  const libraryRounds = useLibraryStore((state) => state.libraryRounds);
  const getLibraryRounds = useLibraryStore((state) => state.getLibraryRounds);
  const quizRounds = useQuizStore((state) => state.rounds);
  const onAddRoundToQuiz = useQuizStore((state) => state.onAddRoundToQuiz);

  const rounds = getLibraryRounds(quizRounds.map((r) => r.id.toString()));

  return (
    <div className="flex flex-col gap-2">
      <Input placeholder="Search your Rounds..." />
      <h4 className="min-w-fit self-end text-xs">
        Showing {rounds.length} of {libraryRounds.length}
      </h4>
      <Accordion type="multiple">
        <div className="flex flex-col gap-2">
          {rounds.map((r) => (
            <RoundItem key={r.id} round={r} onAddToQuiz={onAddRoundToQuiz} />
          ))}
        </div>
      </Accordion>
    </div>
  );
};
