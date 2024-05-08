import { Form, useNavigate, useNavigation } from "@remix-run/react";
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

  const { state } = useNavigation();
  const isPending = Boolean(state === "submitting" || state === "loading");

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Question</DialogTitle>
        </DialogHeader>
        <Form method="post">
          <p>Are you sure you wish to delete this Question?</p>
          <p>{title}</p>

          {errorMessage && <FormMessage>{errorMessage}</FormMessage>}

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
