import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  json,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useState } from "react";
import {
  RemixFormProvider,
  getValidatedFormData,
  useRemixForm,
} from "remix-hook-form";
import { z } from "zod";
import { authCookie } from "~/api/auth/authCookie";
import { getAuthenticatedUserId } from "~/api/auth/authQueries";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormItems,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
  Textarea,
} from "~/components/ui";
import { dbQuestionCreate } from "./dbQuestionCreate";

const QuestionCategoryValues = [
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
const QuestionCategoryEnum = z.enum(QuestionCategoryValues);
export type QuestionCategoryType = z.infer<typeof QuestionCategoryEnum>;

const formSchema = z.object({
  title: z.string().min(2).max(220),
  answer: z.string().min(1).max(220),
  points: z.number().int().min(1).max(10),
  category: QuestionCategoryEnum,
  tags: z.array(z.string().min(1).max(80)).optional(),
});
const resolver = zodResolver(formSchema);
export type QuestionCreateFormType = z.infer<typeof formSchema>;

export const action = async ({ request }: ActionFunctionArgs) => {
  // Validate Form Data
  const { receivedValues, errors, data } =
    await getValidatedFormData<QuestionCreateFormType>(request, resolver);
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  // Create Round
  const userId = await getAuthenticatedUserId(request);
  await dbQuestionCreate(data, userId ?? 0);

  // Close Modal
  return redirect("/quiz/questions");
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let cookieString = request.headers.get("Cookie");
  let userId = await authCookie.parse(cookieString);
  if (!userId) {
    return redirect("/");
  }
  return { userId };
};

const QuestionCreatePage = () => {
  const [categoryOpen, setCategoryOpen] = useState(false);

  const actionRes = useActionData<typeof action>();

  const navigate = useNavigate();
  const { state } = useNavigation();

  const closeModal = () => navigate("/quiz/questions");

  const isSubmitting = Boolean(state === "submitting" || state === "loading");

  const form = useRemixForm<QuestionCreateFormType>({
    resolver,
    defaultValues: {
      points: 1,
      category: "General Knowledge",
    },
  });

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Question</DialogTitle>
        </DialogHeader>
        <Form method="post" onSubmit={form.handleSubmit}>
          <RemixFormProvider {...form}>
            <FormItems>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is the capital of Ireland..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Dublin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="points"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={[value]}
                        onValueChange={(vals) => {
                          onChange(vals[0]);
                        }}
                        value={[form.getValues("points")]}
                      />
                    </FormControl>
                    <FormDescription>
                      Most Questions should be worth just 1 point.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="justify-start">
                            {form.getValues("category") || "Select Category..."}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start">
                        <Command>
                          <CommandInput placeholder="Select Category..." />
                          <CommandEmpty>No Results</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {QuestionCategoryValues?.map((category) => (
                                <CommandItem
                                  value={category}
                                  key={category}
                                  className={`
                                    ${
                                      category === form.getValues("category") &&
                                      "bg-zinc-300 font-bold"
                                    }`}
                                  onSelect={() => {
                                    form.setValue("category", category);
                                    setCategoryOpen(false);
                                  }}
                                >
                                  {category}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Set a Category to better organize your library.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItems>

            {actionRes?.error && <FormMessage>{actionRes.error}</FormMessage>}

            <DialogFooter className="pt-8">
              <Button disabled={isSubmitting} type="submit" className="w-full">
                Create
              </Button>
            </DialogFooter>
          </RemixFormProvider>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionCreatePage;
