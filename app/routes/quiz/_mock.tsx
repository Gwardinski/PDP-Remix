import { v4 as uuidv4 } from "uuid";
import { Question, Round } from "./_state";

const r1Id = `ROUND-${uuidv4()}`;
const r2Id = `ROUND-${uuidv4()}`;
const q1Id = `QUESTION-${uuidv4()}`;
const q2Id = `QUESTION-${uuidv4()}`;
const q3Id = `QUESTION-${uuidv4()}`;
const q4Id = `QUESTION-${uuidv4()}`;
const q5Id = `QUESTION-${uuidv4()}`;

const q1lId = `QUESTION-${uuidv4()}`;
const q2lId = `QUESTION-${uuidv4()}`;
const q3lId = `QUESTION-${uuidv4()}`;
const q4lId = `QUESTION-${uuidv4()}`;

const r1lId = `ROUND-${uuidv4()}`;
const r2lId = `ROUND-${uuidv4()}`;
const q1lrId = `QUESTION-${uuidv4()}`;
const q2lrId = `QUESTION-${uuidv4()}`;
const q3lrId = `QUESTION-${uuidv4()}`;
const q4lrId = `QUESTION-${uuidv4()}`;

export const MOCK_INITIAL_DATA: Round[] = [
  {
    id: r1Id,
    title: "General Knowledge",
    questions: [
      {
        id: q1Id,
        rid: r1Id,
        title: "What is the capital of Scotland",
        answer: "Edinburgh",
        points: 1,
      },
      {
        id: q2Id,
        rid: r1Id,
        title: "What name is commonly given to our moon",
        answer: "Luna",
        points: 1,
      },
    ],
  },
  {
    id: r2Id,
    title: "Heavy Metal",
    questions: [
      {
        id: q3Id,
        rid: r2Id,
        title: "What is Ozzy Osbourne's real name",
        answer: "John Michael Osbourne",
        points: 1,
      },
      {
        id: q4Id,
        rid: r2Id,
        title: "Glasgows greatest metal band",
        answer: "Bleed From Within",
        points: 1,
      },
      {
        id: q5Id,
        rid: r2Id,
        title: "Who plays drums for both Bleed from Within and Sylosis",
        answer: "Ali Richardson",
        points: 1,
      },
    ],
  },
];

export const MOCK_LIBRARY_ROUNDS: Round[] = [
  {
    id: r1lId,
    title: "Geography",
    questions: [
      {
        id: q1lrId,
        rid: r1lId,
        title: "What is the capital of France",
        answer: "Paris",
        points: 1,
      },
      {
        id: q2lrId,
        rid: r1lId,
        title: "What is the capital of England",
        answer: "London",
        points: 1,
      },
    ],
  },
  {
    id: r2lId,
    title: "Sports",
    questions: [
      {
        id: q3lrId,
        rid: r2lId,
        title: "Which country has won every single World Series",
        answer: "USA",
        points: 1,
      },
      {
        id: q4lrId,
        rid: r2lId,
        title: "Something about Tennis",
        answer: "14 Love",
        points: 1,
      },
    ],
  },
];

export const MOCK_LIBRARY_QUESTIONS: Question[] = [
  {
    id: q1lId,
    rid: null,
    title: "Who is the CEO of Apple",
    answer: "Tim Cook",
    points: 1,
  },
  {
    id: q2lId,
    rid: null,
    title: "What year was the Battle of Hastings",
    answer: "1066",
    points: 1,
  },
  {
    id: q3lId,
    rid: null,
    title: "Which Pokemon is number 1 in the Pokedex",
    answer: "Bulbasaur",
    points: 1,
  },
  {
    id: q4lId,
    rid: null,
    title: "Which Pokemon is number 100 in the Pokedex",
    answer: "Voltorb",
    points: 1,
  },
];
