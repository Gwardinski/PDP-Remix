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
  useLoaderData,
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
import { dbQuizEditDetails, dbQuizGet } from "~/api/quiz";
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
  id: z.number(),
  title: z.string().min(2).max(100),
  description: z.string().max(400).optional().default(""),
});
const resolver = zodResolver(formSchema);
type QuizEditDetailsFormType = z.infer<typeof formSchema>;

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // Validate Form Data
  const { receivedValues, errors, data } =
    await getValidatedFormData<QuizEditDetailsFormType>(request, resolver);
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }

  // Edit Quiz
  await dbQuizEditDetails({
    ...data,
    uid,
  });

  // Close Modal
  const zid = Number(params.id);
  return redirect(`/quiz/${zid}`);
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const zid = Number(params.id);
  if (!zid) {
    return redirect("/library/quizzes");
  }
  const quiz = await dbQuizGet(zid);
  if (quiz?.uid !== uid) {
    return redirect("/library/quizzes");
  }
  return { quiz };
};

const QuizEditPage = () => {
  const actionRes = useActionData<typeof action>();
  const loaderRes = useLoaderData<typeof loader>();
  const { quiz } = loaderRes;

  const form = useRemixForm<QuizEditDetailsFormType>({
    resolver,
    defaultValues: {
      id: quiz?.id,
      title: quiz?.title,
      description: quiz?.description ?? "",
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
          <DialogTitle>Edit Quiz</DialogTitle>
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
            </FormItems>

            {actionRes?.error && <FormMessage>{actionRes.error}</FormMessage>}

            <DialogFooter className="pt-8">
              <Button disabled={isPending} type="submit" className="w-full">
                Save Changes
              </Button>
            </DialogFooter>
          </RemixFormProvider>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuizEditPage;
