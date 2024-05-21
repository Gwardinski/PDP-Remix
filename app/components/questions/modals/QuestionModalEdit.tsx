import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import {
  QuestionCategoryEnum,
  QuestionCategoryType,
  QuestionCategoryValues,
} from "~/api/types";
import { useIsPending } from "~/components/layout";
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

const QuestionEditFormSchema = z.object({
  id: z.number(),
  title: z.string().min(2).max(220),
  answer: z.string().min(1).max(220),
  points: z.number().int().min(1).max(10),
  category: QuestionCategoryEnum,
  tags: z.array(z.string().min(1).max(80)).optional(),
});
export const EditQuestionResolver = zodResolver(QuestionEditFormSchema);
export type QuestionEditFormType = z.infer<typeof QuestionEditFormSchema>;

type QuestionModalEditProps = {
  basePath: string;
  actionError?: string;
  question: {
    id: number;
    createdAt: string;
    updatedAt: string;
    uid: number;
    title: string;
    answer: string;
    points: number;
    category: string;
    published: boolean;
    roundQuestions: {
      rid: number;
    }[];
  };
};

export const QuestionModalEdit: React.FC<QuestionModalEditProps> = ({
  basePath,
  actionError,
  question,
}) => {
  const form = useRemixForm<QuestionEditFormType>({
    resolver: EditQuestionResolver,
    defaultValues: {
      id: question?.id,
      title: question?.title,
      answer: question?.answer,
      points: question?.points || 1,
      category:
        (question?.category as QuestionCategoryType) || "General Knowledge",
    },
  });

  const [categoryOpen, setCategoryOpen] = useState(false);

  const navigate = useNavigate();
  const closeModal = () => navigate(basePath, { replace: true });

  const { isPending } = useIsPending();

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
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

              {actionError && <FormMessage>{actionError}</FormMessage>}

              <Button
                disabled={isPending}
                type="submit"
                className="mt-4 w-full"
              >
                Save Changes
              </Button>
            </FormItems>
          </RemixFormProvider>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
