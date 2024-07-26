import {
  IconCircleDashed,
  IconCircleDashedCheck,
  IconPlayerPlay,
  IconPlayerStop,
} from "@tabler/icons-react";
import { Button } from "~/components/ui";
import { useMetronomeState } from "./_state";

export const PlayStop = () => {
  const isPlaying = useMetronomeState((state) => state.isPlaying);
  const setIsPlaying = useMetronomeState((state) => state.setIsPlaying);
  const playNotes = useMetronomeState((state) => state.playNotes);
  const setPlayNotes = useMetronomeState((state) => state.setPlayNotes);

  return (
    <section className="flex w-full flex-col items-center justify-center gap-2">
      <Button
        className={`h-12 w-full ${isPlaying ? "bg-red-700 hover:bg-red-800" : "bg-green-700 hover:bg-green-800"} `}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? <IconPlayerStop /> : <IconPlayerPlay />}
      </Button>
      <Button
        variant={playNotes ? "default" : "outline"}
        className={`flex h-10 w-full gap-2`}
        onClick={() => setPlayNotes(!playNotes)}
      >
        Sub Divisions
        {playNotes ? <IconCircleDashedCheck /> : <IconCircleDashed />}
      </Button>
    </section>
  );
};
