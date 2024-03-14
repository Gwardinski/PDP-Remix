import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import {
  Button,
  FormContainer,
  FormItem,
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
  const isSubmitting = Boolean(state === "submitting");

  const { handleSubmit, register, formState } = useRemixForm<FormType>({
    resolver,
    defaultValues: {
      password: "",
    },
  });

  return (
    <>
      {response?.success && <h3>Password successfully reset</h3>}

      {!response?.success && (
        <Form method="post" onSubmit={handleSubmit}>
          <FormContainer>
            <h3>Enter your new password</h3>
            <FormItem>
              <FormLabel>Password</FormLabel>
              <Input {...register("password")} />
              {formState.errors.password && (
                <FormMessage>{formState.errors.password.message}</FormMessage>
              )}
            </FormItem>

            <FormItem>
              {response?.error && <FormMessage>{response.error}</FormMessage>}
              <Button disabled={isSubmitting} type="submit">
                Submit
              </Button>
            </FormItem>
          </FormContainer>
        </Form>
      )}
    </>
  );
};

export default PasswordNewPage;
