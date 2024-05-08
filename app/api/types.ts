import { z } from "zod";

export const QuestionCategoryValues = [
  "General Knowledge",
  "Science",
  "History",
  "Geography",
  "Art",
  "Sports",
  "Music",
  "Movies",
  "Politics",
  "Literature",
  "Technology",
  "Nature",
  "Other",
] as const;
export const QuestionCategoryEnum = z.enum(QuestionCategoryValues);
export type QuestionCategoryType = z.infer<typeof QuestionCategoryEnum>;
