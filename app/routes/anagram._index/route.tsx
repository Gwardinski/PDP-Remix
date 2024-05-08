import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useState } from "react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormItem,
  FormItems,
  FormLabel,
  FormMessage,
  Input,
} from "~/components/ui";
import { AnagramFormType, anagramFormSchema } from "./_types";
import { solveAnagram } from "./queries";

const resolver = zodResolver(anagramFormSchema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // If being passed back from the results page, pre-fill the form
  const url = new URL(request.url);
  const anagram = url.searchParams.get("anagram");
  const category = url.searchParams.get("category");
  const noOfWords = url.searchParams.get("noOfWords");
  const clue = url.searchParams.get("clue");

  return {
    anagram,
    category,
    noOfWords,
    clue,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  // Validate Form Data
  const { receivedValues, errors, data } =
    await getValidatedFormData<AnagramFormType>(request, resolver);
  if (errors) {
    return json({ errors, receivedValues, message: null, error: null }, 400);
  }
  // Solve Anagram
  const res = await solveAnagram(data);
  if (res.error) {
    return json({ error: res.error.toString(), message: null }, 200);
  }
  // Redirect with result
  const message = res.data?.message.content;
  const { anagram, category, noOfWords, clue } = data;
  let redirectUrl = `/anagram/result?anagram=${anagram}&&message=${message}`;
  if (category) {
    redirectUrl += `&&category=${category}`;
  }
  if (noOfWords) {
    redirectUrl += `&&noOfWords=${noOfWords}`;
  }
  if (clue) {
    redirectUrl += `&&clue=${clue}`;
  }
  return redirect(redirectUrl);
};

const AnagramFormPage = () => {
  const data = useLoaderData<typeof loader>();
  const { anagram, category, noOfWords, clue } = data;

  const response = useActionData<typeof action>();

  const [showHints, setShowHints] = useState<boolean>(
    Boolean(category || noOfWords || clue),
  );

  const { state } = useNavigation();
  const isPending = Boolean(state === "submitting" || state === "loading");

  const defaultNoOfWords = noOfWords ? parseInt(noOfWords) : undefined;

  const { handleSubmit, register, formState, resetField } =
    useRemixForm<AnagramFormType>({
      resolver,
      defaultValues: {
        anagram: anagram ?? "",
        category: category ?? "",
        noOfWords:
          typeof defaultNoOfWords === "number" ? defaultNoOfWords : undefined,
        clue: clue ?? "",
      },
    });

  const onShowHints = () => {
    if (!showHints) {
      setShowHints(true);
      return;
    }
    setShowHints(false);
    resetField("category");
    resetField("clue");
    resetField("noOfWords");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anagram Solver</CardTitle>
        <CardDescription>
          Enter details of your Anagram to get an answer
        </CardDescription>
      </CardHeader>
      <Form method="post" onSubmit={handleSubmit}>
        <CardContent>
          <FormItems>
            <FormItem>
              <FormLabel>Anagram</FormLabel>
              <Input {...register("anagram")} />
              {formState.errors.anagram && (
                <FormMessage>{formState.errors.anagram.message}</FormMessage>
              )}
            </FormItem>

            {showHints && (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Input {...register("category")} />
                {formState.errors.category && (
                  <FormMessage>{formState.errors.category.message}</FormMessage>
                )}
              </FormItem>
            )}

            {showHints && (
              <FormItem>
                <FormLabel>Clue</FormLabel>
                <Input {...register("clue")} />
                {formState.errors.clue && (
                  <FormMessage>{formState.errors.clue.message}</FormMessage>
                )}
              </FormItem>
            )}

            {showHints && (
              <FormItem>
                <FormLabel>Number of Words</FormLabel>
                <Input
                  type="number"
                  {...register("noOfWords", { valueAsNumber: true })}
                />
                {formState.errors.noOfWords && (
                  <FormMessage>
                    {formState.errors.noOfWords.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          </FormItems>
        </CardContent>

        <CardFooter>
          <Button
            variant="outline"
            onClick={onShowHints}
            disabled={isPending}
            type="button"
          >
            {showHints ? "Remove Hints" : "Add Hints"}
          </Button>
          {response?.error && <FormMessage>{response.error}</FormMessage>}
          <Button disabled={isPending} type="submit">
            Submit
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
};

export default AnagramFormPage;
