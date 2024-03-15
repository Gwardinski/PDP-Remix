import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  json,
  useActionData,
  useNavigation,
  useRouteLoaderData,
} from "@remix-run/react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { authCookie } from "~/api/auth/authCookie";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "~/components/ui";
import { RootLoader } from "~/root";
import { updateUsersName } from "./queries";

const formSchema = z.object({
  name: z.string().min(1).max(80),
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

  let cookieString = request.headers.get("Cookie");
  let userId = await authCookie.parse(cookieString);
  if (!userId) {
    return redirect("/");
  }

  // Update
  const { name } = data;
  await updateUsersName(userId, name);

  return null;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let cookieString = request.headers.get("Cookie");
  let userId = await authCookie.parse(cookieString);
  if (!userId) {
    return redirect("/");
  }

  return {};
};

const AccountEditPage = () => {
  const data = useRouteLoaderData<RootLoader>("root");
  const response = useActionData<typeof action>();

  const { state } = useNavigation();
  const isSubmitting = Boolean(state === "submitting" || state === "loading");

  const { handleSubmit, register, formState } = useRemixForm<FormType>({
    resolver,
    defaultValues: {
      name: data?.user?.name,
    },
  });

  return (
    <Card className="max-w-lg">
      <Form method="post" onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Update details</CardTitle>
          <CardDescription>Change your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <FormItem>
            <FormLabel>Display Name</FormLabel>
            <Input {...register("name")} />
            {formState.errors.name && (
              <FormMessage>{formState.errors.name.message}</FormMessage>
            )}
          </FormItem>
        </CardContent>
        <CardFooter>
          <FormItem>
            {response?.error && <FormMessage>{response.error}</FormMessage>}
            <Button disabled={isSubmitting} type="submit">
              Submit
            </Button>
          </FormItem>
        </CardFooter>
      </Form>
    </Card>
  );
};

export default AccountEditPage;
