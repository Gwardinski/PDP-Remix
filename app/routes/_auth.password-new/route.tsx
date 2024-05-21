import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import {
  RemixFormProvider,
  getValidatedFormData,
  useRemixForm,
} from "remix-hook-form";
import { z } from "zod";
import { useIsPending } from "~/components/layout";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormItem,
  FormItems,
  FormLabel,
  FormMessage,
  Input,
} from "~/components/ui";

const formSchema = z.object({
  password: z.string().min(8).max(50),
});
const resolver = zodResolver(formSchema);
type FormType = z.infer<typeof formSchema>;

export const action = async ({ request }: ActionFunctionArgs) => {
  // Validate Form Data
  const { receivedValues, errors, data } = await getValidatedFormData<FormType>(
    request,
    resolver,
  );
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null });
  }

  return json({ success: true, error: false });
};

const PasswordNewPage = () => {
  const response = useActionData<typeof action>();

  const { isPending } = useIsPending();

  const form = useRemixForm<FormType>({
    resolver,
    defaultValues: {
      password: "",
    },
  });

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>New Password</CardTitle>
        <CardDescription>
          Doesn't work. Abandoned since switching from Supabase auth
        </CardDescription>
      </CardHeader>

      <Form method="post" onSubmit={form.handleSubmit}>
        <RemixFormProvider {...form}>
          <CardContent>
            <FormItems>
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input />
                <FormMessage />
              </FormItem>
            </FormItems>
          </CardContent>

          <CardFooter>
            {response?.error && <FormMessage>{response.error}</FormMessage>}
            <Button disabled={isPending} type="submit">
              Submit
            </Button>
          </CardFooter>
        </RemixFormProvider>
      </Form>
    </Card>
  );
};

export default PasswordNewPage;
