import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "~/components/ui";

const roundCreateSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
});

export type RoundCreate = z.infer<typeof roundCreateSchema>;

type CreateRoundModalProps = {
  onCreateRound: (values: RoundCreate) => void;
};

export const CreateRoundModal: React.FC<CreateRoundModalProps> = ({
  onCreateRound,
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<RoundCreate>({
    resolver: zodResolver(roundCreateSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (values: RoundCreate) => {
    form.reset();
    setOpen(false);
    onCreateRound(values);
  };

  const onOpenChange = () => {
    setOpen((o) => !o);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Create New Round</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Round</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormItem>
              <FormLabel>Round Title</FormLabel>

              <Input
                placeholder="General Knowledge"
                {...form.register("title")}
              />

              <FormMessage />
            </FormItem>

            <Button type="submit" className="w-full">
              Create Round
            </Button>
          </form>
        </Form>

        <DialogFooter className="-mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
