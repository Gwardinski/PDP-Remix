import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  json,
  useActionData,
  useNavigation,
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
  FormItems,
  FormLabel,
  FormMessage,
  Input,
} from "~/components/ui";
import { signInWithEmailAndPassword } from "~/routes/_auth.sign-in/queries";

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
  const uid = await signInWithEmailAndPassword(email, password);

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
  let cookieString = request.headers.get("Cookie");
  let userId = await authCookie.parse(cookieString);
  if (userId) {
    return redirect("/");
  }
  return {};
};

const SignInPage = () => {
  const response = useActionData<typeof action>();

  const { state } = useNavigation();
  const isSubmitting = Boolean(state === "submitting" || state === "loading");

  const { handleSubmit, register, formState } = useRemixForm<FormType>({
    resolver,
  });

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Sign In!</CardTitle>
        <CardDescription>
          Enter your email & password to continue.
        </CardDescription>
      </CardHeader>

      <Form method="post" onSubmit={handleSubmit}>
        <CardContent>
          <FormItems>
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input placeholder="bla@mail.com" {...register("email")} />
              {formState.errors.email && (
                <FormMessage>{formState.errors.email.message}</FormMessage>
              )}
            </FormItem>

            <FormItem>
              <FormLabel>Password</FormLabel>
              <Input type="password" {...register("password")} />
              {formState.errors.password && (
                <FormMessage>{formState.errors.password.message}</FormMessage>
              )}
            </FormItem>
          </FormItems>
        </CardContent>

        {response?.error && (
          <CardContent>
            <FormMessage>{response.error}</FormMessage>
          </CardContent>
        )}

        <CardFooter>
          <Button disabled={isSubmitting} type="submit">
            Submit
          </Button>
          <Button variant="link" disabled={isSubmitting} type="submit" asChild>
            <Link to="/password-reset">Forgot Password</Link>
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
};

export default SignInPage;
