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

type QuestionModalPublishProps = {
  qid: number;
  title: string;
  errorMessage: string;
  basePath: string;
};
export const QuestionModalPublish: React.FC<QuestionModalPublishProps> = ({
  qid,
  title,
  errorMessage,
  basePath,
}) => {
  const navigate = useNavigate();
  const closeModal = () => navigate(basePath, { replace: true });

  const { state } = useNavigation();
  const isPending = Boolean(state === "submitting" || state === "loading");

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish Question</DialogTitle>
        </DialogHeader>
        <Form method="post">
          <p>Are you sure you wish to publish this Question?</p>
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};
