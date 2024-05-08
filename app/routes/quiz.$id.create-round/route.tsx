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
import { dbRoundCreateAsChild } from "~/api/round";
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
  title: z.string().min(2).max(100),
  description: z.string().max(400).optional().default(""),
});
const resolver = zodResolver(formSchema);
export type RoundCreateFormType = z.infer<typeof formSchema>;

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // Validate Check
  const { receivedValues, errors, data } =
    await getValidatedFormData<RoundCreateFormType>(request, resolver);
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  // Permissions Check
  const zid = Number(params.id);
  const uid = await isAuthenticated(request);

  if (!zid) {
    return redirect(`/library/quizzes`);
  }
  if (!uid) {
    return redirect(`/quiz/${zid}`);
  }

  // Create Content
  await dbRoundCreateAsChild({
    uid,
    zid,
    ...data,
  });

  // Close Modal
  return redirect(`/quiz/${zid}`);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  return true;
};

const RoundCreateQuizPage = () => {
  const actionRes = useActionData<typeof action>();

  const navigate = useNavigate();
  const { state } = useNavigation();

  const closeModal = () => navigate(-1);

  const isPending = Boolean(state === "submitting" || state === "loading");

  const form = useRemixForm<RoundCreateFormType>({
    resolver,
  });

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Round</DialogTitle>
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
                Create Round
              </Button>
            </DialogFooter>
          </RemixFormProvider>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoundCreateQuizPage;
