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
import { isAuthenticated, isAuthorisedToEdit } from "~/api/auth";
import { dbRoundGet, dbRoundPublish } from "~/api/round";
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
  id: z.number(),
});
const resolver = zodResolver(formSchema);
type RoundPublishFormType = z.infer<typeof formSchema>;

export const action = async ({ request }: ActionFunctionArgs) => {
  const { receivedValues, errors, data } =
    await getValidatedFormData<RoundPublishFormType>(request, resolver);
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  // Publish Round
  const uid = await isAuthenticated(request);
  await dbRoundPublish({
    ...data,
    uid: uid ?? 0,
  });

  // Close Modal
  return redirect("/library/rounds");
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const rid = Number(params.id);
  if (!rid) {
    return redirect("/library/rounds");
  }
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const round = await dbRoundGet(rid);
  if (!isAuthorisedToEdit(round?.uid, uid)) {
    return redirect("/library/rounds");
  }
  return { round };
};

const RoundPublishPage = () => {
  const actionRes = useActionData<typeof action>();
  const loaderRes = useLoaderData<typeof loader>();
  const { round } = loaderRes;

  const form = useRemixForm<RoundPublishFormType>({
    resolver,
    defaultValues: {
      id: round?.id,
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
          <DialogTitle>Publish {round?.title}</DialogTitle>
        </DialogHeader>
        <Form method="post" onSubmit={form.handleSubmit}>
          <RemixFormProvider {...form}>
            <p>Are you sure you wish to publish this Round?</p>
            {round?.noOfQuestions && (
              <p>The Questions in this Round will also be published.</p>
            )}

            {actionRes?.error && <FormMessage>{actionRes.error}</FormMessage>}

            <DialogFooter className="pt-8">
              <Button
                variant="destructive"
                type="submit"
                disabled={isPending}
                className="w-full"
              >
                Publish
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

export default RoundPublishPage;
