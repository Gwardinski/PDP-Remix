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
  useRouteLoaderData,
} from "@remix-run/react";
import {
  RemixFormProvider,
  getValidatedFormData,
  useRemixForm,
} from "remix-hook-form";
import { z } from "zod";
import { isAuthenticated } from "~/api/auth";
import { useIsPending } from "~/components/layout";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormControl,
  FormField,
  FormItem,
  FormItems,
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

  const uid = await isAuthenticated(request);
  if (!uid) {
    return null;
  }

  // Update
  const { name } = data;
  await updateUsersName(uid, name);

  return null;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  return true;
};

const AccountEditPage = () => {
  const data = useRouteLoaderData<RootLoader>("root");
  const response = useActionData<typeof action>();

  const { isPending } = useIsPending();

  const form = useRemixForm<FormType>({
    resolver,
    defaultValues: {
      name: data?.user?.name,
    },
  });

  return (
    <Card>
      <Form method="post" onSubmit={form.handleSubmit}>
        <CardHeader>
          <CardTitle>Update details</CardTitle>
          <CardDescription>Change your account details</CardDescription>
        </CardHeader>
        <RemixFormProvider {...form}>
          <CardContent>
            <FormItems>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItems>
          </CardContent>

          {response?.error && (
            <CardContent>
              <FormMessage>{response.error}</FormMessage>
            </CardContent>
          )}

          <CardFooter>
            <Button disabled={isPending} type="submit">
              Submit
            </Button>
          </CardFooter>
        </RemixFormProvider>
      </Form>
    </Card>
  );
};

export default AccountEditPage;
