import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import clsx from "clsx";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import { Toaster } from "sonner";
import stylesheet from "~/globals.css";
import { dbGetAuthenticatedUser } from "./api/auth";
import {
  AppBackground,
  AppFooter,
  AppHeader,
  AppLoader,
} from "./components/layout";
import { themeSessionResolver } from "./sessions.server";

export const meta: MetaFunction = () => {
  return [
    { title: "PDP Playground" },
    {
      name: "PDP Playground",
      content: "Personal Development Project Playground",
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export type RootLoader = typeof loader;
export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);
  const user = await dbGetAuthenticatedUser(request);

  return {
    theme: getTheme(),
    userId: user?.id,
    user,
  };
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

export function App() {
  const { theme: sessionTheme } = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(sessionTheme)} />
        <Links />
      </head>

      <body className="text-zinc-950 dark:text-zinc-50">
        <AppBackground />

        <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 overflow-y-auto px-2 md:px-4">
          <AppLoader />

          <main className="flex min-h-screen w-full max-w-[1600px] flex-1 flex-col overflow-y-auto overflow-x-clip pb-20">
            <AppHeader />
            <Outlet />
            <AppFooter />
          </main>
        </div>

        <Toaster />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
