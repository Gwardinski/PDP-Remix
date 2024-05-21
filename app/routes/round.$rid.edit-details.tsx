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
import { dbRoundGet } from "~/api/round";
import { dbRoundEditDetails } from "~/api/round/dbRoundEdit";
import { useIsPending } from "~/components/layout";
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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const rid = Number(params.rid);
  if (!rid) {
    return redirect("/library/rounds");
  }
  const round = await dbRoundGet({ rid, uid });
  if (round?.uid !== uid) {
    return redirect("/library/rounds");
  }
  return { round };
};

const formSchema = z.object({
  id: z.number(),
  title: z.string().min(2).max(100),
  description: z.string().max(400).optional().default(""),
});
const resolver = zodResolver(formSchema);
type RoundEditDetailsFormType = z.infer<typeof formSchema>;

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // Validate Form Data
  const { receivedValues, errors, data } =
    await getValidatedFormData<RoundEditDetailsFormType>(request, resolver);
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }

  // Edit Round
  await dbRoundEditDetails({
    ...data,
    uid,
  });

  // Close Modal
  const rid = Number(params.rid);
  return redirect(`/round/${rid}/questions`);
};

const RoundEdit = () => {
  const actionRes = useActionData<typeof action>();
  const loaderRes = useLoaderData<typeof loader>();
  const { round } = loaderRes;

  const form = useRemixForm<RoundEditDetailsFormType>({
    resolver,
    defaultValues: {
      id: round?.id,
      title: round?.title,
      description: round?.description ?? "",
    },
  });

  const navigate = useNavigate();
  const closeModal = () => navigate(-1);

  const { isPending } = useIsPending();

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Round</DialogTitle>
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

export default RoundEdit;
