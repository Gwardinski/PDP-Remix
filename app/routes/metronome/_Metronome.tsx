import { useEffect, useMemo, useState } from "react";
import { useMetronomeState } from "./_state";

export const Metronome = () => {
  const [clickSound] = useState(new Audio("click.wav"));
  const isPlaying = useMetronomeState((state) => state.isPlaying);
  const beats = useMetronomeState((state) => state.beats);
  const bpm = useMetronomeState((state) => state.bpm);

  const currentBeat = useMetronomeState((state) => state.currentBeat);
  const setCurrentBeat = useMetronomeState((state) => state.setCurrentBeat);

  const interval = useMemo(() => 60000 / bpm, [bpm]);

  useEffect(() => {
    let count = 1;
    let intervalId: NodeJS.Timeout;

    if (isPlaying) {
      intervalId = setInterval(() => {
        const sound = clickSound.cloneNode() as HTMLAudioElement;
        if (count !== 1) {
          sound.volume = 0.5;
        }
        count++;
        sound.play();
        if (count > beats) {
          count = 1;
        }
      }, interval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, bpm, clickSound]);

  return (
    <div className="flex w-full items-center justify-center rounded-lg border border-zinc-900 p-4">
      <h1 className="text-[120px]">{currentBeat}</h1>
    </div>
  );
};
