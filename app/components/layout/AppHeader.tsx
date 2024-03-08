import { Link } from "@remix-run/react";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui";
import { AppDrawerToggle } from "./AppDrawer";

export const AppHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-start gap-4 bg-zinc-50 px-2 dark:bg-zinc-950 md:h-20 md:bg-transparent dark:md:bg-transparent">
      <AppDrawerToggle />
      <ThemeToggle />
      <Link to={"/"}>
        <Button variant="outline">PDP Playground</Button>
      </Link>
    </header>
  );
};
