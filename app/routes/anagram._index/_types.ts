import { z } from "zod";

export const anagramFormSchema = z.object({
  anagram: z.string().min(1).max(100),
  category: z.string().min(1).max(100).optional(),
  clue: z.string().min(1).max(100).optional(),
  noOfWords: z.number().int().min(1).max(16).optional(),
});

export type AnagramFormType = z.infer<typeof anagramFormSchema>;

export type ChatGPTResponseType = {
  index: number;
  finish_reason: FinishReason;
  message: {
    content: string;
    role: Role;
  };
};

export type APIResponse<T> = {
  data?: T;
  error?: ErrorCode;
};

// TODO: Expand for proper error handling
type ErrorCode = 1 | 2;
type Role = "assistant" | "user" | "system";
type FinishReason =
  | "stop"
  | "length"
  | "function_call"
  | "content_filter"
  | "null";
