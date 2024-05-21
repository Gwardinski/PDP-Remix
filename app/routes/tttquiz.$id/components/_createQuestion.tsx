import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "~/components/ui";

const questionCreateSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  answer: z.string().min(1, {
    message: "Answer must be at least 1 characters.",
  }),
  points: z.coerce
    .number()
    .min(1, {
      message: "Question must be worth at least 1 point.",
    })
    .max(10, {
      message: "Question can only be worth 10 points max.",
    }),
});

export type QuestionCreate = z.infer<typeof questionCreateSchema>;

type CreateQuestionModalProps = {
  onCreateQuestion: (values: QuestionCreate) => void;
};

export const CreateQuestion: React.FC<CreateQuestionModalProps> = ({
  onCreateQuestion,
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<QuestionCreate>({
    resolver: zodResolver(questionCreateSchema),
    defaultValues: {
      title: "",
      answer: "",
      points: 1,
    },
  });

  const onSubmit = (values: QuestionCreate) => {
    form.reset();
    setOpen(false);
    onCreateQuestion(values);
  };

  const onOpenChange = () => {
    setOpen((o) => !o);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Create New Question</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Question</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormItem>
              <FormLabel>Question</FormLabel>
              <Input
                placeholder="What is the Capital of Scotland"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <FormMessage>{form.formState.errors.title.message}</FormMessage>
              )}
            </FormItem>

            <FormItem>
              <FormLabel>Answer</FormLabel>
              <Input placeholder="Edinburgh" {...form.register("answer")} />
              {form.formState.errors.answer && (
                <FormMessage>
                  {form.formState.errors.answer.message}
                </FormMessage>
              )}
            </FormItem>

            <FormItem>
              <FormLabel>Points</FormLabel>
              <Input
                type="number"
                min={1}
                max={10}
                className="w-1/3"
                {...form.register("points")}
              />
              {form.formState.errors.points && (
                <FormMessage>
                  {form.formState.errors.points.message}
                </FormMessage>
              )}
            </FormItem>

            <Button type="submit" className="w-full">
              Create Question
            </Button>
          </form>
        </Form>

        <DialogFooter className="-mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
