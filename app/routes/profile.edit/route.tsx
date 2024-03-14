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

const ProfilePageEdit = () => {
  const data = useRouteLoaderData<RootLoader>("root");
  const response = useActionData<typeof action>();

  const { state } = useNavigation();
  const isSubmitting = Boolean(state === "submitting");

  const { handleSubmit, register, formState } = useRemixForm<FormType>({
    resolver,
    defaultValues: {
      name: data?.user?.name,
    },
  });

  return (
    <PageLayout>
      <PageHeader>
        <H1>Edit Profile</H1>
        <PageAccordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="description">
              <AccordionTrigger className="gap-4">
                <div className="flex items-start justify-start gap-2">
                  Using <CodeSnippet>remix-hook-form</CodeSnippet> to edit
                  profile
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
          </FormItems>
        </Form>
      </FormContainer>
    </PageLayout>
  );
};

export default ProfilePageEdit;
