import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Button } from "~/components/ui";
import {
  SettingsBox,
  SettingsRow,
  SettingsTitle,
  SettingsValue,
} from "./_components";
import { useMetronomeState } from "./_state";

export const SettingsTime = () => {
  const beats = useMetronomeState((state) => state.beats);
  const setBeats = useMetronomeState((state) => state.setBeats);
  const notes = useMetronomeState((state) => state.notes);
  const setNotes = useMetronomeState((state) => state.setNotes);

  return (
    <section className="flex flex-col items-center justify-center gap-2 p-4">
      <SettingsBox>
        <SettingsTitle>Time Signature</SettingsTitle>
        <SettingsRow>
          <Button size="icon" onClick={() => setBeats(beats - 1)}>
            <IconMinus />
          </Button>
          <SettingsValue>{beats}</SettingsValue>
          <Button size="icon" onClick={() => setBeats(beats + 1)}>
            <IconPlus />
          </Button>
        </SettingsRow>
        <div className="h-1 w-16 rounded-full bg-zinc-900" />
        <SettingsRow>
          <Button size="icon" onClick={() => setNotes(beats - 1)}>
            <IconMinus />
          </Button>
          <SettingsValue>{notes}</SettingsValue>
          <Button size="icon" onClick={() => setNotes(beats + 1)}>
            <IconPlus />
          </Button>
        </SettingsRow>
      </SettingsBox>
    </section>
  );
};
