import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, json, useActionData } from "@remix-run/react";
import {
  RemixFormProvider,
  getValidatedFormData,
  useRemixForm,
} from "remix-hook-form";
import { z } from "zod";
import {
  authCookie,
  dbSignInWithEmailAndPassword,
  isAuthenticated,
} from "~/api/auth";
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

const formSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(1).max(32),
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
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  // Sign In
  const { email, password } = data;
  const uid = await dbSignInWithEmailAndPassword(email, password);

  if (!uid) {
    return json(
      {
        success: false,
        error: "Incorrect Email / Password combination",
      },
      400,
    );
  }
  return redirect("/", {
    headers: { "Set-Cookie": await authCookie.serialize(uid) },
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (uid) {
    return redirect("/");
  }
  return true;
};

const SignInPage = () => {
  const response = useActionData<typeof action>();

  const { isPending } = useIsPending();

  const form = useRemixForm<FormType>({
    resolver,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign In!</CardTitle>
        <CardDescription>
          Enter your email & password to continue.
        </CardDescription>
      </CardHeader>

      <Form method="post" onSubmit={form.handleSubmit}>
        <RemixFormProvider {...form}>
          <CardContent>
            <FormItems>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
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
            <Button variant="link" disabled={isPending} type="submit" asChild>
              <Link to="/password-reset">Forgot Password</Link>
            </Button>
          </CardFooter>
        </RemixFormProvider>
      </Form>
    </Card>
  );
};

export default SignInPage;
