import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { db } from "~/api/db";
import { items } from "~/api/schema";
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
} from "~/components/ui";
import { createSupabaseServerClient } from "~/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Drizzle Supabase" },
    {
      name: "Drizzle Supabase",
      content: "Using Drizzle to get data from Supabase",
    },
  ];
};

const getUser = async (request: Request) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) {
    return null;
  }
  return user;
};

type Item = typeof items.$inferInsert;
export async function action({ request }: ActionFunctionArgs) {
  const user = await getUser(request);
  if (!user) {
    return redirect("/");
  }
  const formData = await request.formData();
  const formContent = Object.fromEntries(formData) as Partial<Item>;
  const newItem: Item = {
    title: formContent.title!,
    description: formContent.description!,
    uid: user.id,
  };
  await db.insert(items).values(newItem);
  return true;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (!user) {
    return redirect("/");
  }
  const uid = user.id;

  const data = await db.select().from(items).where(eq(items.uid, uid));

  return json({
    data,
  });
}

export default function ListPage() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>{"Drizzle / Supabase Test Page"}</PageTitle>
        <PageAccordionDescription>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="gap-4">
                <div className="flex flex-col items-start justify-start gap-2">
                  <p>Using Drizzle ORM to connect to Supabase.</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6"></AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageAccordionDescription>
      </PageHeader>

      <div className="flex flex-col gap-8">
        <Form method="POST" className="flex flex-col gap-1">
          <input type="text" name="title" placeholder="title" />
          <input type="text" name="description" placeholder="description" />
          <input type="submit" value="Submit" />
        </Form>

        <div className="flex flex-col gap-4">
          {data.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
