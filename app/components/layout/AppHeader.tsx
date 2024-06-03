import { Link } from "@remix-run/react";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui";
import { AppBackgroundToggle } from "./AppBackground";
import { AppDrawerToggle } from "./AppDrawer";

export const AppHeader: React.FC = () => {
  return (
    <header className="flex h-2 min-h-20 w-full items-center justify-start gap-4 overflow-hidden bg-transparent">
      <AppDrawerToggle />
      <Link to={"/"}>
        <Button variant="outline">PDP Playground</Button>
      </Link>
      <ThemeToggle />
      <AppBackgroundToggle />
    </header>
  );
};
