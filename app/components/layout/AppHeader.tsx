import { Form, Link, useLoaderData } from "@remix-run/react";
import { RootLoader } from "~/root";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui";
import { AppBackgroundToggle } from "./AppBackground";

export const AppHeader: React.FC = () => {
  const { userId, user } = useLoaderData<RootLoader>();

  return (
    <header className="flex h-2 min-h-20 w-full items-center justify-start gap-4 overflow-hidden bg-transparent">
      <Link to={"/"}>
        <Button variant="outline">PDP Playground</Button>
      </Link>
      <ThemeToggle />
      <AppBackgroundToggle />
      <div className="ml-auto flex items-center justify-end gap-4">
        {!userId && (
          <>
            <Button className="w-full" asChild>
              <Link to={"/sign-up"}>Sign Up</Link>
            </Button>
            <Button className="w-full" asChild>
              <Link to={"/sign-in"}>Sign In</Link>
            </Button>
          </>
        )}
        {userId && (
          <>
            <Button className="w-full" asChild>
              <Link to={"/account/edit"}>{user?.name}</Link>
            </Button>
            <Form action="/sign-out" method="post">
              <Button type="submit" className="w-full">
                Sign Out
              </Button>
            </Form>
          </>
        )}
      </div>
    </header>
  );
};
