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
import { PageAccordion, PageHeader, PageLayout } from "~/components/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  FormContainer,
  FormItem,
  FormItems,
  FormLabel,
  FormMessage,
  H1,
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
  const isSubmitting = Boolean(state === "submitting");

  const { handleSubmit, register, formState } = useRemixForm<FormType>({
    resolver,
  });

  return (
    <PageLayout>
      <PageHeader>
        <H1>Sign In</H1>
        <PageAccordion>
          <Accordion type="single" collapsible>
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
        </PageAccordion>
      </PageHeader>

      <FormContainer>
        <Form method="post" onSubmit={handleSubmit}>
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
              {response?.error && <FormMessage>{response.error}</FormMessage>}
              <Button disabled={isSubmitting} type="submit">
                Submit
              </Button>
              <Button
                variant="link"
                disabled={isSubmitting}
                type="submit"
                asChild
              >
                <Link to="/password-reset">Forgot Password</Link>
              </Button>
            </FormItem>
          </FormItems>
        </Form>
      </FormContainer>
    </PageLayout>
  );
};

export default SignInPage;
