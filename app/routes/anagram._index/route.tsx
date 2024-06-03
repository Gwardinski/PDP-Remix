import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  RemixFormProvider,
  getValidatedFormData,
  useRemixForm,
} from "remix-hook-form";
import { useIsPending } from "~/components/layout";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormControl,
  FormField,
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

  const { isPending } = useIsPending();

  const defaultNoOfWords = noOfWords ? parseInt(noOfWords) : undefined;

  const form = useRemixForm<AnagramFormType>({
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
    form.resetField("category");
    form.resetField("clue");
    form.resetField("noOfWords");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anagram Solver</CardTitle>
        <CardDescription>
          Enter details of your Anagram to get an answer
        </CardDescription>
      </CardHeader>
      <Form method="post" onSubmit={form.handleSubmit}>
        <RemixFormProvider {...form}>
          <CardContent>
            <FormItems>
              <FormField
                control={form.control}
                name="anagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anagram</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showHints && (
                <>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noOfWords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No of Words</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clue</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
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
        </RemixFormProvider>
      </Form>
    </Card>
  );
};

export default AnagramFormPage;
