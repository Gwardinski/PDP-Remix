import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useNavigate } from "@remix-run/react";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { useIsPending } from "~/components/layout";
import {
  Button,
  Dialog,
  DialogContent,
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

const RoundCreateFormSchema = z.object({
  title: z.string().min(2).max(220),
  description: z.string().min(1).max(220),
});
export const createRoundResolver = zodResolver(RoundCreateFormSchema);
export type RoundCreateFormType = z.infer<typeof RoundCreateFormSchema>;

type RoundModalCreateProps = {
  basePath: string;
  actionError?: string;
};

export const RoundModalCreate: React.FC<RoundModalCreateProps> = ({
  basePath,
  actionError,
}) => {
  const form = useRemixForm<RoundCreateFormType>({
    resolver: createRoundResolver,
  });

  const navigate = useNavigate();
  const closeModal = () => navigate(basePath, { replace: true });

  const { isPending } = useIsPending();

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

              {actionError && <FormMessage>{actionError}</FormMessage>}

              <Button
                disabled={isPending}
                type="submit"
                className="mt-4 w-full"
              >
                Create Round
              </Button>
            </FormItems>
          </RemixFormProvider>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
