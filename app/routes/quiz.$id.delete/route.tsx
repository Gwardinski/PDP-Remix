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
} from "@remix-run/react";
import {
  RemixFormProvider,
  getValidatedFormData,
  useRemixForm,
} from "remix-hook-form";
import { z } from "zod";
import { isAuthenticated } from "~/api/auth";
import { dbQuizGet } from "~/api/quiz";
import { dbQuizDelete } from "~/api/quiz/dbQuizDelete";
import { useIsPending } from "~/components/layout";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormMessage,
} from "~/components/ui";

const formSchema = z.object({
  zid: z.number(),
});
const resolver = zodResolver(formSchema);
type QuizDeleteFormType = z.infer<typeof formSchema>;

export const action = async ({ request }: ActionFunctionArgs) => {
  // Validate Form Data
  const { receivedValues, errors, data } =
    await getValidatedFormData<QuizDeleteFormType>(request, resolver);
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  // Delete Quiz
  const uid = await isAuthenticated(request);
  await dbQuizDelete({
    ...data,
    uid: uid ?? 0,
  });

  // Close Modal
  return redirect("/library/quizzes");
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const zid = Number(params.zid);
  if (!zid) {
    return redirect("/library/quizzes");
  }
  const quiz = await dbQuizGet({ zid, uid });
  if (quiz?.uid !== uid) {
    return redirect("/library/quizzes");
  }
  return { quiz };
};

const QuizDeletePage = () => {
  const actionRes = useActionData<typeof action>();
  const loaderRes = useLoaderData<typeof loader>();
  const { quiz } = loaderRes;

  const form = useRemixForm<QuizDeleteFormType>({
    resolver,
    defaultValues: {
      zid: quiz?.id,
    },
  });

  const navigate = useNavigate();
  const closeModal = () => navigate(-1);

  const { isPending } = useIsPending();

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Quiz</DialogTitle>
        </DialogHeader>
        <Form method="post" onSubmit={form.handleSubmit}>
          <RemixFormProvider {...form}>
            <p>Are you sure you wish to delete this Quiz?</p>
            <p>{quiz?.title}</p>
            <p>
              This will not delete any Rounds or Questions associated with this
              Quiz
            </p>

            {actionRes?.error && <FormMessage>{actionRes.error}</FormMessage>}

            <DialogFooter className="pt-8">
              <Button
                variant="destructive"
                type="submit"
                disabled={isPending}
                className="w-full"
              >
                Delete
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={isPending}
                onClick={closeModal}
                className="w-full"
              >
                Cancel
              </Button>
            </DialogFooter>
          </RemixFormProvider>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuizDeletePage;
