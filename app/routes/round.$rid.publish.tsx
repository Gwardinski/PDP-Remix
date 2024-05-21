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
import { dbRoundGet, dbRoundPublish } from "~/api/round";
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
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  const rid = Number(params.rid);
  if (!rid) {
    return redirect("/library/rounds");
  }
  const round = await dbRoundGet({ rid, uid });
  if (!round) {
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
  await dbRoundPublish({
    uid,
    rid: Number(selectedRound),
  });

  // Close Modal
  return redirect("/library/rounds");
};

const RoundPublish = () => {
  const actionRes = useActionData<typeof action>();
  const loaderRes = useLoaderData<typeof loader>();
  const { round } = loaderRes;

  const navigate = useNavigate();
  const closeModal = () => navigate(-1);

  const { isPending } = useIsPending();

  const hasQuestions = round?.noOfQuestions > 0;

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish {round?.title}</DialogTitle>
        </DialogHeader>
        <Form method="post">
          {!hasQuestions && <p>You cannot publish an empty Round</p>}
          {hasQuestions && (
            <>
              <p>Are you sure you wish to publish this Round?</p>
              <p>All of your Questions in this Round will also be published.</p>
            </>
          )}

          <DialogFooter className="pt-8">
            {hasQuestions && (
              <Button
                variant="destructive"
                value={round.id}
                name="selectedRound"
                type="submit"
                disabled={isPending}
                className="w-full"
              >
                Publish
              </Button>
            )}
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

export default RoundPublish;
