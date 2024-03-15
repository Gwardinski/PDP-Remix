import { Form, Link, useLoaderData } from "@remix-run/react";
import { Menu } from "lucide-react";
import { create } from "zustand";
import { RootLoader } from "../../root";
import { Button } from "../ui/button";

interface AppDrawerStore {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const useAppDrawerStore = create<AppDrawerStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set((_) => ({ isOpen: false })),
}));

export const AppDrawer: React.FC = () => {
  const { userId, user } = useLoaderData<RootLoader>();

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
      {!userId && (
        <>
          <Button onClick={close} className="w-full" asChild>
            <Link to={"/sign-up"}>Sign Up</Link>
          </Button>
          <Button onClick={close} className="w-full" asChild>
            <Link to={"/sign-in"}>Sign In</Link>
          </Button>
        </>
      )}
      {userId && (
        <>
          <Button onClick={close} className="w-full" asChild>
            <Link to={"/account/edit"}>{user?.name}</Link>
          </Button>
          <Form action="/sign-out" method="post">
            <Button onClick={close} type="submit" className="w-full">
              Sign Out
            </Button>
          </Form>
        </>
      )}
      <Button onClick={close} className="w-full" asChild>
        <Link to={"/anagram"}>Anagram Solver - GPT</Link>
      </Button>
      <Button onClick={close} className="w-full" asChild>
        <Link to={"/quiz"}>Quiz - DnD Kit</Link>
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
