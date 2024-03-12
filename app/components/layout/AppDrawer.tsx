import { Form, Link } from "@remix-run/react";
import { Menu } from "lucide-react";
import { create } from "zustand";
import { Button } from "../ui/button";

interface AppDrawerStore {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const useAppDrawerStore = create<AppDrawerStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set((state) => ({ isOpen: false })),
}));

export const AppDrawer: React.FC = () => {
  const isOpen = useAppDrawerStore((state) => state.isOpen);
  const close = useAppDrawerStore((state) => state.close);

  return (
    <nav
      className={`no-scrollbar fixed top-16 z-40 flex h-full w-full flex-col gap-3 overflow-y-auto overflow-x-hidden bg-zinc-50 p-2 pb-20 transition-all duration-200 ease-in-out dark:bg-zinc-950 md:top-20 md:w-80 ${
        // on larger screens, ignore isOpen and always show the menu
        isOpen ? "left-0" : "-left-full md:left-0"
      }`}
    >
      <Button onClick={close} className="w-full" asChild>
        <Link to={"/"}>Home</Link>
      </Button>
      <Button onClick={close} className="w-full" asChild>
        <Link to={"/quiz"}>Quiz DnD Kit</Link>
      </Button>
      <Button onClick={close} className="w-full" asChild>
        <Link to={"/sign-in"}>Sign In</Link>
      </Button>
      <Button onClick={close} className="w-full" asChild>
        <Link to={"/sign-up"}>Sign Up</Link>
      </Button>
      <Form action="/sign-out" method="post">
        <Button onClick={close} type="submit" className="w-full">
          Sign Out
        </Button>
      </Form>
      <Button onClick={close} className="w-full" asChild>
        <Link to={"/dashboard"}>Dashboard</Link>
      </Button>
    </nav>
  );
};

export const AppDrawerToggle: React.FC = () => {
  const toggle = useAppDrawerStore((state) => state.toggle);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="flex border-none md:hidden"
      onClick={toggle}
    >
      <Menu />
    </Button>
  );
};
