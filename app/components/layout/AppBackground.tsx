import { IconBackground } from "@tabler/icons-react";
import { useTheme } from "remix-themes";
import { create } from "zustand";
import videoLight from "../../../public/vbg1.mp4";
import videoDark from "../../../public/vbg2.mp4";
import { Button } from "../ui";

interface VideoBGStore {
  isOn: boolean;
  toggle: () => void;
}

const useVideoBGStore = create<VideoBGStore>((set) => ({
  isOn: true,
  toggle: () => set((state) => ({ isOn: !state.isOn })),
}));

export const AppBackground: React.FC = () => {
  const [theme] = useTheme();

  const isOn = useVideoBGStore((state) => state.isOn);

  return (
    <>
      {/* bg image */}
      <div className="fixed left-0 top-0 h-screen min-h-screen w-screen bg-[url('/bg1.jpeg')] bg-cover bg-fixed bg-center blur-lg dark:bg-zinc-950 dark:bg-[url('/bg2.jpeg')]" />
      {/* bg video */}
      {theme === "dark" && isOn && (
        <video
          muted
          loop
          autoPlay
          id="myVideo"
          className="fixed left-0 top-0 h-screen min-h-screen w-screen object-cover"
        >
          <source src={videoDark} type="video/mp4" />
        </video>
      )}
      {theme === "light" && isOn && (
        <video
          muted
          loop
          autoPlay
          id="myVideo"
          className="fixed left-0 top-0 h-screen min-h-screen w-screen object-cover"
        >
          <source src={videoLight} type="video/mp4" />
        </video>
      )}
      {/* bg blur */}
      {isOn && (
        <div className="dark:filter-dark fixed left-0 top-0 h-screen min-h-screen w-screen object-cover filter" />
      )}
    </>
  );
};

export const AppBackgroundToggle: React.FC = () => {
  const toggle = useVideoBGStore((state) => state.toggle);

  return (
    <Button size="icon" variant="outline" onClick={toggle}>
      <IconBackground />
    </Button>
  );
};
