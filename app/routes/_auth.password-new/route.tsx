import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { z } from "zod";
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

  const { state } = useNavigation();
  const isSubmitting = Boolean(state === "submitting" || state === "loading");

  const { handleSubmit, register, formState } = useRemixForm<FormType>({
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

      <Form method="post" onSubmit={handleSubmit}>
        <CardContent>
          <FormItems>
            <FormItem>
              <FormLabel>Password</FormLabel>
              <Input {...register("password")} />
              {formState.errors.password && (
                <FormMessage>{formState.errors.password.message}</FormMessage>
              )}
            </FormItem>
          </FormItems>
        </CardContent>

        <CardFooter>
          {response?.error && <FormMessage>{response.error}</FormMessage>}
          <Button disabled={isSubmitting} type="submit">
            Submit
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
};

export default PasswordNewPage;
