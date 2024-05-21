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
import { isAuthenticated } from "~/api/auth";
import { authCookie } from "~/api/auth/authCookie";
import { dbCheckAccountAlreadyExists } from "~/api/auth/dbCheckAccountExists";
import { dbSignUpWithEmailAndPassword } from "~/api/auth/dbSignUpWithEmailPassword";
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
  email: z.string().min(2).max(80),
  password: z.string().min(8).max(32),
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

  // Sign Up
  const { email, password, name } = data;
  const exists = await dbCheckAccountAlreadyExists(email);
  if (exists) {
    return json({
      success: false,
      error: "An account with this email already exists",
    });
  }
  const uid = await dbSignUpWithEmailAndPassword(email, password, name);
  return redirect("/", {
    headers: {
      "Set-Cookie": await authCookie.serialize(uid),
    },
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (uid) {
    return redirect("/");
  }
  return true;
};

const SignUpPage = () => {
  const response = useActionData<typeof action>();

  const { isPending } = useIsPending();

  const form = useRemixForm<FormType>({
    resolver,
  });

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Sign Up!</CardTitle>
        <CardDescription>
          Enter your email, password and name to create an account
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

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
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
            <Button variant="link" disabled={isPending} asChild>
              <Link to="/sign-in">Already Registered? Sign in here</Link>
            </Button>
          </CardFooter>
        </RemixFormProvider>
      </Form>
    </Card>
  );
};

export default SignUpPage;
