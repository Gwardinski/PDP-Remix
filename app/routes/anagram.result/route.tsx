import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const message = url.searchParams.get("message");
  const anagram = url.searchParams.get("anagram");
  const category = url.searchParams.get("category");
  const noOfWords = url.searchParams.get("noOfWords");
  const clue = url.searchParams.get("clue");
  let redirectUrl = `/anagram/?anagram=${anagram}`;
  if (category) {
    redirectUrl += `&&category=${category}`;
  }
  if (noOfWords) {
    redirectUrl += `&&noOfWords=${noOfWords}`;
  }
  if (clue) {
    redirectUrl += `&&clue=${clue}`;
  }

  return {
    message,
    anagram,
    category,
    noOfWords,
    clue,
    redirectUrl,
  };
};

const AnagramResultPage = () => {
  const response = useLoaderData<typeof loader>();

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{response.anagram}</CardTitle>
      </CardHeader>
      <CardContent>
        {response.category && <p>Category: {response.category}</p>}
        {response.noOfWords && <p>No of Words: {response.noOfWords}</p>}
        {response.clue && <p>Clue: {response.clue}</p>}
      </CardContent>
      <CardContent>
        <p className="text-sm">The answer is:</p>
        <p className="text-xl">"{response.message}"</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild>
          <Link to={response.redirectUrl}>Not Right?</Link>
        </Button>
        <Button asChild>
          <Link to="/anagram">Try Another</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnagramResultPage;
