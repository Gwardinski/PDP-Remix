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
import {
  checkAccountAlreadyExists,
  signUpWithEmailAndPassword,
} from "./queries";

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
  const exists = await checkAccountAlreadyExists(email);
  if (exists) {
    return json({
      success: false,
      error: "An account with this email already exists",
    });
  }
  const uid = await signUpWithEmailAndPassword(email, password, name);
  return redirect("/", {
    headers: {
      "Set-Cookie": await authCookie.serialize(uid),
    },
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

const SignUpPage = () => {
  const response = useActionData<typeof action>();

  const { state } = useNavigation();
  const isSubmitting = Boolean(state === "submitting" || state === "loading");

  const { handleSubmit, register, formState } = useRemixForm<FormType>({
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

            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <Input {...register("name")} />
              {formState.errors.name && (
                <FormMessage>{formState.errors.name.message}</FormMessage>
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
          <Button variant="link" disabled={isSubmitting} asChild>
            <Link to="/sign-in">Already Registered? Sign in here</Link>
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
};

export default SignUpPage;
