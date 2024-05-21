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

  const { isPending } = useIsPending();

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish Question</DialogTitle>
        </DialogHeader>
        <Form method="post">
          <div className="flex flex-col gap-4">
            <p>Are you sure you wish to publish this Question?</p>
            <p>{title}</p>
            {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
          </div>

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
