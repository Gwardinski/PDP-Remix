import { useEffect } from "react";
import { useMetronomeState } from "./_state";

export const Metronome = () => {
  const isPlaying = useMetronomeState((state) => state.isPlaying);
  const beats = useMetronomeState((state) => state.beats);
  const bpm = useMetronomeState((state) => state.bpm);

  const currentBeat = useMetronomeState((state) => state.currentBeat);
  const setCurrentBeat = useMetronomeState((state) => state.setCurrentBeat);

  const secondsBetweenBeats = 60 / bpm;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const interval = setInterval(() => {
      beep();
      setCurrentBeat(currentBeat + 1 > beats ? 1 : currentBeat + 1);
    }, secondsBetweenBeats * 1000);
    return () => clearInterval(interval);
  }, [isPlaying, secondsBetweenBeats]);

  function beep() {
    console.log("beep");
  }

  return (
    <div className="flex w-full items-center justify-center rounded-lg border border-zinc-900 p-4">
      <h1 className="text-[120px]">{currentBeat}</h1>
    </div>
  );
};
