import { Form, useNavigate } from "@remix-run/react";
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

type QuestionModalDeleteProps = {
  qid: number;
  title: string;
  errorMessage: string;
  basePath: string;
};
export const QuestionModalDelete: React.FC<QuestionModalDeleteProps> = ({
  qid,
  title,
  errorMessage,
  basePath,
}) => {
  const navigate = useNavigate();
  const closeModal = () => navigate(basePath);

  const { isPending } = useIsPending();

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Question</DialogTitle>
        </DialogHeader>
        <Form method="post">
          <div className="flex flex-col gap-4">
            <p>Are you sure you wish to delete this Question?</p>
            <p>{title}</p>
            {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
          </div>

          <DialogFooter className="pt-8">
            <Button
              name="selectedQuestion"
              value={qid}
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};
