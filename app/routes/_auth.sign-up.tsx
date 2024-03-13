import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, useActionData, useNavigation } from "@remix-run/react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { z } from "zod";
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
import { createSupabaseServerClient } from "~/supabase.server";

const formSchema = z.object({
  email: z.string().min(2).max(80),
  password: z.string().min(16).max(32),
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

  // Supabase Sign Up
  const { supabaseClient } = createSupabaseServerClient(request);
  const { email, password, name } = data;
  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  if (error) {
    // TODO: handle each error type individually
    console.log(error);
    return json({ success: false, error: "Sorry. An error has occurred" });
  }
  return json({ success: true, error: false });
};

const SignUpPage = () => {
  const response = useActionData<typeof action>();

  const { state } = useNavigation();
  const isSubmitting = Boolean(state === "submitting");

  const { handleSubmit, register, formState } = useRemixForm<FormType>({
    resolver,
    defaultValues: {
      email: "",
    },
  });

  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>Supabase Auth - Sign Up</PageTitle>
        <PageAccordionDescription>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="gap-4">
                <div className="flex items-start justify-start gap-2">
                  Using <CodeSnippet>@supabase/ssr</CodeSnippet> &{" "}
                  <CodeSnippet>remix-hook-form</CodeSnippet> to register
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6">
                <GithubLink text="Source Code" href="/TODO" />
                <DocumentationLink
                  href="https://supabase.com/docs/guides/auth/server-side/creating-a-client"
                  text="Supabase Auth"
                />
                <DocumentationLink
                  href="https://www.npmjs.com/package/remix-hook-form"
                  text="Remix Hook Form"
                />
                <VideoLink
                  href="https://www.youtube.com/watch?v=iom5nnj29sY"
                  text="Mastering Form Submissions in Remix with react-hook-form, remix-hook-form, zod, and Shadcn-UI"
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
              </FormItem>
            </FormContainer>
          </Form>
        )}
      </>
    </PageLayout>
  );
};

export default SignUpPage;
