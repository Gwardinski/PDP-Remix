import { Form, Link, useLoaderData } from "@remix-run/react";
import { IconLock } from "@tabler/icons-react";
import { Menu } from "lucide-react";
import { create } from "zustand";
import { RootLoader } from "../../root";
import { H3 } from "../ui";
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
      className={`no-scrollbar glass dark:dark-glass sticky top-16 z-40 mb-4 flex h-full w-full flex-col gap-3 overflow-y-auto overflow-x-hidden rounded-lg px-4 pb-8 pt-4 transition-all duration-200 ease-in-out ${
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
      <H3>Playground</H3>
      <Button onClick={close} className="w-full" asChild>
        <Link to={"/anagram"}>
          GPT Anagram Solver{" "}
          {!userId && <IconLock className="absolute right-6" />}
        </Link>
      </Button>
      <Button onClick={close} className="w-full" asChild>
        <Link to={"/kt"}>
          KT (WIP) {!userId && <IconLock className="absolute right-6" />}
        </Link>
      </Button>
      <H3>Apps</H3>
      <Button onClick={close} className="w-full" asChild>
        <a href="https://quizflow-gm.vercel.app" target="_blank">
          QuizFlow (WIP)
        </a>
      </Button>
      <Button onClick={close} className="w-full" asChild>
        <a href="https://pixelboard-gm.vercel.app/" target="_blank">
          PixelBoard
        </a>
      </Button>
      <Button onClick={close} className="w-full" asChild>
        <a href="https://pantie-packer.vercel.app" target="_blank">
          PantiePacker
        </a>
      </Button>
      <Button onClick={close} className="w-full" asChild>
        <a href="https://anagram-cruncher.vercel.app" target="_blank">
          Anagram Cruncher
        </a>
      </Button>
      <Button onClick={close} className="w-full" disabled>
        Push The Button
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
