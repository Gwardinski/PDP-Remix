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
import { isAuthenticated } from "~/api/auth";
import { dbQuestionCreateAsChild } from "~/api/question";
import { QuestionCategoryEnum, QuestionCategoryValues } from "~/api/types";
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

const formSchema = z.object({
  title: z.string().min(2).max(220),
  answer: z.string().min(1).max(220),
  points: z.number().int().min(1).max(10),
  category: QuestionCategoryEnum,
  tags: z.array(z.string().min(1).max(80)).optional(),
});
const resolver = zodResolver(formSchema);
type QuestionCreateFormType = z.infer<typeof formSchema>;

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // Validate Check
  const { receivedValues, errors, data } =
    await getValidatedFormData<QuestionCreateFormType>(request, resolver);
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  // Permissions Check
  const rid = Number(params.id);
  const uid = await isAuthenticated(request);

  if (!rid) {
    return redirect(`/library/rounds`);
  }
  if (!uid) {
    return redirect(`/round/${rid}`);
  }

  // Create Content
  await dbQuestionCreateAsChild({
    ...data,
    uid,
    rid,
  });

  // Close Modal
  return redirect(`/round/${rid}`);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  return true;
};

const QuestionCreateRoundPage = () => {
  const actionRes = useActionData<typeof action>();

  const [categoryOpen, setCategoryOpen] = useState(false);

  const form = useRemixForm<QuestionCreateFormType>({
    resolver,
    defaultValues: {
      points: 1,
      category: "General Knowledge",
    },
  });

  const navigate = useNavigate();

  const closeModal = () => navigate(-1);

  const { state } = useNavigation();
  const isPending = Boolean(state === "submitting" || state === "loading");

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
                render={() => (
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

              {actionRes?.error && <FormMessage>{actionRes.error}</FormMessage>}

              <Button
                disabled={isPending}
                type="submit"
                className="mt-4 w-full"
              >
                Create Question
              </Button>
            </FormItems>
          </RemixFormProvider>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionCreateRoundPage;
