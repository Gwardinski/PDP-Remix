import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { isAuthenticated } from "~/api/auth";
import { dbRoundDelete, dbRoundGet } from "~/api/round";
import { useIsPending } from "~/components/layout";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const rid = Number(params.rid);
  if (!rid) {
    return redirect("/library/rounds");
  }
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }

  const round = await dbRoundGet({ rid, uid });
  if (round?.uid !== uid) {
    return redirect("/library/rounds");
  }

  return { round };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }

  const formData = await request.formData();
  const selectedRound = formData.get("selectedRound");
  await dbRoundDelete({
    uid,
    rid: Number(selectedRound),
  });

  // Close Modal
  return redirect("/library/rounds");
};

const RoundDelete = () => {
  const actionRes = useActionData<typeof action>();
  const loaderRes = useLoaderData<typeof loader>();
  const { round } = loaderRes;

  const navigate = useNavigate();
  const closeModal = () => navigate(-1);

  const { isPending } = useIsPending();

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {round?.title}</DialogTitle>
        </DialogHeader>
        <Form method="post">
          <p>Are you sure you wish to delete this Round?</p>
          {round.noOfQuestions > 0 && (
            <p>
              The Questions in this Round will <i>not</i> be deleted.
            </p>
          )}

          <DialogFooter className="pt-8">
            <Button
              variant="destructive"
              value={round.id}
              name="selectedRound"
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoundDelete;
