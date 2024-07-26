import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Button, Slider } from "~/components/ui";
import { bpmMax, bpmMin, bpmStep, useMetronomeState } from "./_state";

export const BPMController = () => {
  const bpm = useMetronomeState((state) => state.bpm);
  const setBpm = useMetronomeState((state) => state.setBpm);

  function incrementBPM() {
    if (bpm >= bpmMax) {
      return;
    }
    setBpm(bpm + 1);
  }

  function decrementBPM() {
    if (bpm <= bpmMin) {
      return;
    }
    setBpm(bpm - 1);
  }

  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <header className="flex flex-col items-center justify-center">
        <h1 className="w-32 text-center text-[80px] leading-[80px]">{bpm}</h1>
        <p>Beats Per Minute (BPM)</p>
      </header>

      <div className="flex w-full items-center justify-center gap-4">
        <Button size="icon" className="rounded-lg" onMouseDown={decrementBPM}>
          <IconMinus />
        </Button>
        <Slider
          showThumbs={false}
          value={[bpm]}
          defaultValue={[bpm]}
          min={bpmMin}
          max={bpmMax}
          step={bpmStep}
          onValueChange={(v) => setBpm(v[0] ?? bpmMin)}
          className="w-full min-w-64"
        />
        <Button size="icon" className="rounded-lg" onMouseDown={incrementBPM}>
          <IconPlus />
        </Button>
      </div>
    </section>
  );
};
