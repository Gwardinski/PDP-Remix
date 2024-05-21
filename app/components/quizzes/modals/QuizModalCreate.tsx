import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useNavigate } from "@remix-run/react";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { useIsPending } from "~/components/layout";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormField,
  FormItem,
  FormItems,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "~/components/ui";

const QuizCreateFormSchema = z.object({
  title: z.string().min(2).max(220),
  description: z.string().min(1).max(220),
});
export const createQuizResolver = zodResolver(QuizCreateFormSchema);
export type QuizCreateFormType = z.infer<typeof QuizCreateFormSchema>;

type QuizModalCreateProps = {
  basePath: string;
  actionError?: string;
};

export const QuizModalCreate: React.FC<QuizModalCreateProps> = ({
  basePath,
  actionError,
}) => {
  const form = useRemixForm<QuizCreateFormType>({
    resolver: createQuizResolver,
  });

  const navigate = useNavigate();
  const closeModal = () => navigate(basePath, { replace: true });

  const { isPending } = useIsPending();

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Quiz</DialogTitle>
        </DialogHeader>
        <Form method="post" onSubmit={form.handleSubmit}>
          <RemixFormProvider {...form}>
            <FormItems>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
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
                Create Quiz
              </Button>
            </FormItems>
          </RemixFormProvider>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
