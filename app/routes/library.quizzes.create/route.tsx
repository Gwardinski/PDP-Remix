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
import {
  RemixFormProvider,
  getValidatedFormData,
  useRemixForm,
} from "remix-hook-form";
import { z } from "zod";
import { isAuthenticated } from "~/api/auth";
import { dbQuizCreate } from "~/api/quiz";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
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

const formSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(400).default(""),
});
const resolver = zodResolver(formSchema);
type QuizCreateFormType = z.infer<typeof formSchema>;

export const action = async ({ request }: ActionFunctionArgs) => {
  // Validate Form Data
  const { receivedValues, errors, data } =
    await getValidatedFormData<QuizCreateFormType>(request, resolver);
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  // Create Question
  const uid = await isAuthenticated(request);
  await dbQuizCreate({
    ...data,
    uid: uid ?? 0,
  });

  // Close Modal
  return redirect("/library/quizzes");
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  return true;
};

const QuizCreatePage = () => {
  const actionRes = useActionData<typeof action>();

  const form = useRemixForm<QuizCreateFormType>({
    resolver,
  });

  const navigate = useNavigate();
  const closeModal = () => navigate(-1);

  const { state } = useNavigation();
  const isPending = Boolean(state === "submitting" || state === "loading");

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
                    <FormLabel>Quiz Name</FormLabel>
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
            </FormItems>

            {actionRes?.error && <FormMessage>{actionRes.error}</FormMessage>}

            <DialogFooter>
              <Button disabled={isPending} type="submit" className="w-full">
                Create Quiz
              </Button>
            </DialogFooter>
          </RemixFormProvider>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuizCreatePage;
