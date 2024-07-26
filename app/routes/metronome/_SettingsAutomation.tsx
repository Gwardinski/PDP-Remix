import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Button } from "~/components/ui";
import {
  SettingsBox,
  SettingsRow,
  SettingsTitle,
  SettingsValue,
} from "./_components";
import { useMetronomeState } from "./_state";

export const SettingsAutomation = () => {
  const incrementBy = useMetronomeState((state) => state.incrementBy);
  const setIncrementBy = useMetronomeState((state) => state.setIncrementBy);
  const incrementStep = useMetronomeState((state) => state.incrementStep);
  const setIncrementStep = useMetronomeState((state) => state.setIncrementStep);
  const incrementLimit = useMetronomeState((state) => state.incrementLimit);
  const setIncrementLimit = useMetronomeState(
    (state) => state.setIncrementLimit,
  );
  const incrementReverse = useMetronomeState((state) => state.incrementReverse);
  const setIncrementReverse = useMetronomeState(
    (state) => state.setIncrementReverse,
  );

  return (
    <section className="flex flex-col items-center justify-center gap-4 p-4">
      <SettingsBox>
        <SettingsTitle>Increment By</SettingsTitle>
        <SettingsRow>
          <Button size="icon" onClick={() => setIncrementBy(incrementBy - 1)}>
            <IconMinus />
          </Button>
          <SettingsValue>{incrementBy} bpm</SettingsValue>
          <Button size="icon" onClick={() => setIncrementBy(incrementBy + 1)}>
            <IconPlus />
          </Button>
        </SettingsRow>
      </SettingsBox>

      <SettingsBox>
        <SettingsTitle>Every</SettingsTitle>
        <SettingsRow>
          <Button
            size="icon"
            onClick={() => setIncrementStep(incrementStep - 1)}
          >
            <IconMinus />
          </Button>
          <SettingsValue>{incrementStep} bars</SettingsValue>
          <Button
            size="icon"
            onClick={() => setIncrementStep(incrementStep + 1)}
          >
            <IconPlus />
          </Button>
        </SettingsRow>
      </SettingsBox>

      <SettingsBox>
        <SettingsTitle>Until</SettingsTitle>
        <SettingsRow>
          <Button
            size="icon"
            onClick={() => setIncrementLimit(incrementStep - 1)}
          >
            <IconMinus />
          </Button>
          <SettingsValue>{incrementLimit} BPM</SettingsValue>
          <Button
            size="icon"
            onClick={() => setIncrementLimit(incrementStep + 1)}
          >
            <IconPlus />
          </Button>
        </SettingsRow>
      </SettingsBox>

      <SettingsBox>
        <SettingsTitle>Reverse & Loop</SettingsTitle>
        <SettingsRow>
          <Button
            size="icon"
            onClick={() => setIncrementReverse(!incrementReverse)}
          >
            {incrementReverse ? "On" : "Off"}
          </Button>
        </SettingsRow>
      </SettingsBox>
    </section>
  );
};
