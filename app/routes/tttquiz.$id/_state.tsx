import { UniqueIdentifier } from "@dnd-kit/core";
import { create } from "zustand";
import {
  MOCK_INITIAL_DATA,
  MOCK_LIBRARY_QUESTIONS,
  MOCK_LIBRARY_ROUNDS,
} from "./_mock";

export type Round = {
  id: UniqueIdentifier;
  title: string;
  questions: Question[];
};
export type Question = {
  id: UniqueIdentifier;
  rid: UniqueIdentifier | null;
  title: string;
  answer: string;
  points: number;
};

type QuizState = {
  // DATA
  rounds: Round[];
  setRounds: (rounds: Round[]) => void;
  onAddRoundToQuiz: (round: Round) => void;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  onAddQuestionToRound: (question: Question, rid: UniqueIdentifier) => void;
  // UI
  roundEditMode: boolean;
  setRoundEditMode: (mode: boolean) => void;
  questionEditMode: boolean;
  setQuestionEditMode: (mode: boolean) => void;
  openRounds: string[];
  setOpenRounds: (rounds: string[]) => void;
  savedOpenRounds: string[];
  setSavedOpenRounds: (rounds: string[]) => void;
  // DND
  activeQuestion: Question | null;
  setActiveQuestion: (question: Question | null) => void;
  activeRound: Round | null;
  setActiveRound: (round: Round | null) => void;
};
export const useQuizStore = create<QuizState>((set, get) => ({
  rounds: MOCK_INITIAL_DATA,
  setRounds: (rounds) => {
    set({ rounds });
  },
  onAddRoundToQuiz: (round) => {
    set((state) => ({
      rounds: [...state.rounds, round],
      questions: [...state.questions, ...round.questions],
    }));
  },
  questions: MOCK_INITIAL_DATA.flatMap((r) => r.questions),
  setQuestions: (questions) => {
    set({ questions });
  },
  onAddQuestionToRound: (question, rid) => {
    question.rid = rid;
    set((state) => ({
      questions: [...state.questions, question],
      rounds: state.rounds.map((r) => {
        if (r.id === rid) {
          r.questions = [...r.questions, question];
        }
        return r;
      }),
    }));
  },
  roundEditMode: false,
  setRoundEditMode: (mode) => {
    set({ roundEditMode: mode });
  },
  questionEditMode: false,
  setQuestionEditMode: (mode) => {
    set({ questionEditMode: mode });
  },
  openRounds: [],
  setOpenRounds: (rounds) => {
    set({ openRounds: rounds });
  },
  savedOpenRounds: [],
  setSavedOpenRounds: (rounds) => {
    set({ savedOpenRounds: rounds });
  },

  activeQuestion: null,
  setActiveQuestion: (question) => {
    set({ activeQuestion: question });
  },
  activeRound: null,
  setActiveRound: (round) => {
    set({ activeRound: round });
  },
}));

type LibraryState = {
  libraryQuestions: Question[];
  getLibraryQuestions: (qids: string[]) => Question[];
  libraryRounds: Round[];
  getLibraryRounds: (rids: string[]) => Round[];
};
export const useLibraryStore = create<LibraryState>((set, get) => ({
  libraryQuestions: MOCK_LIBRARY_QUESTIONS,
  getLibraryQuestions: (qids: string[]) =>
    get().libraryQuestions.filter((q) => !qids.includes(q.id.toString())),
  libraryRounds: MOCK_LIBRARY_ROUNDS,
  getLibraryRounds: (rids: string[]) =>
    get().libraryRounds.filter((r) => !rids.includes(r.id.toString())),
}));
