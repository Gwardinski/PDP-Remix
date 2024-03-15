import OpenAI from "openai";
import { AnagramFormType, APIResponse, ChatGPTResponseType } from "./_types";

const apiKey = process.env.OPENAI_API_KEY;

let openAi: OpenAI;

const createInstance = () => {
  if (!apiKey) {
    console.log("No API Key", apiKey);
    return;
  }
  if (openAi) {
    console.log("Already instantiated");
    return;
  }
  openAi = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });
};

createInstance();

export const solveAnagram = async (
  form: AnagramFormType,
): Promise<APIResponse<ChatGPTResponseType>> => {
  if (!openAi) {
    createInstance();
  }
  try {
    const content = createContent(form);
    const completion = await openAi.chat.completions.create({
      messages: [{ role: "user", content }],
      model: "gpt-3.5-turbo",
    });

    const choice = completion.choices[0] as ChatGPTResponseType;
    const formattedContent = extractTextBetweenQuotes(choice.message.content);
    choice.message.content = formattedContent ?? choice.message.content;

    return { data: choice };
  } catch (e) {
    return { error: 1 };
  }
};

function extractTextBetweenQuotes(input: string): string | null {
  const match = input.match(/"([^"]*)"/);
  return match ? match[1] : null;
}

const createContent = (form: AnagramFormType) => {
  const { anagram, category, clue, noOfWords } = form;
  let prompt = `I need an 'answer' to this anagram: "${anagram}". `;
  prompt += logic;
  prompt += formatting;
  if (category) {
    prompt += `It is in the category of "${category}". `;
  }
  if (clue) {
    prompt += `The clue is: "${clue}". `;
  }
  if (noOfWords && noOfWords > 1) {
    prompt += `The 'answer' is made up of ${noOfWords} words. `;
  }
  return prompt;
};

const logic =
  "The 'answer' must include every letter of the anagram, and each letter can only be used once. ";
const formatting = "Return only a single 'answer' without any additional text.";
