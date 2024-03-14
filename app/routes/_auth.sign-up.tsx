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
  CodeSnippet,
  DocumentationLink,
  GithubLink,
  VideoLink,
} from "~/components/DocText";
import {
  PageAccordionDescription,
  PageHeader,
  PageLayout,
  PageTitle,
} from "~/components/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  FormContainer,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "~/components/ui";
import {
  checkAccountAlreadyExists,
  signUpWithEmailAndPassword,
} from "../api/auth/sign-up";

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
  const isSubmitting = Boolean(state === "submitting");

  const { handleSubmit, register, formState } = useRemixForm<FormType>({
    resolver,
  });

  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>Sign Up</PageTitle>
        <PageAccordionDescription>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="gap-4">
                <div className="flex items-start justify-start gap-2">
                  Using <CodeSnippet>remix-hook-form</CodeSnippet> to register
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6">
                <GithubLink text="Source Code" href="/TODO" />
                <DocumentationLink
                  href="https://www.npmjs.com/package/remix-hook-form"
                  text="Remix Hook Form"
                />
                <VideoLink
                  href="https://www.youtube.com/watch?v=iom5nnj29sY"
                  text="Mastering Form Submissions in Remix with react-hook-form, remix-hook-form, zod, and Shadcn-UI"
                />
                <VideoLink
                  href="https://youtube.com/playlist?list=PLXoynULbYuED9b2k5LS44v9TQjfXifwNu&si=iXhxzfb03tivk4BH"
                  text="Trellix: build a Trello clone using Remix"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageAccordionDescription>
      </PageHeader>

      <>
        {response?.success && <h3>Please check your email.</h3>}

        {!response?.success && (
          <Form method="post" onSubmit={handleSubmit}>
            <FormContainer>
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

              <FormItem>
                {response?.error && <FormMessage>{response.error}</FormMessage>}
                <Button disabled={isSubmitting} type="submit">
                  Submit
                </Button>
                <Button variant="link" disabled={isSubmitting} asChild>
                  <Link to="/sign-in">Already Registered? Sign in here</Link>
                </Button>
              </FormItem>
            </FormContainer>
          </Form>
        )}
      </>
    </PageLayout>
  );
};

export default SignUpPage;
