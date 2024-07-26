import { Button } from "~/components/ui";
import { SettingsBox, SettingsRow, SettingsTitle } from "./_components";
import { useMetronomeState } from "./_state";

export const SettingsSounds = () => {
  const incrementBy = useMetronomeState((state) => state.incrementBy);
  const setIncrementBy = useMetronomeState((state) => state.setIncrementBy);
  const incrementStep = useMetronomeState((state) => state.incrementStep);
  const setIncrementStep = useMetronomeState((state) => state.setIncrementStep);

  return (
    <section className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <SettingsBox>
        <SettingsTitle>Sample</SettingsTitle>
        <SettingsRow>
          <Button className="flex-1">WOOD BLOCK</Button>
          <Button className="flex-1">COWBELL</Button>
          <Button className="flex-1">VOICE</Button>
        </SettingsRow>
      </SettingsBox>

      {/* <SettingsBox>
        <SettingsTitle>Base Pitch</SettingsTitle>
        <SettingsRow>
          <Slider className="w-64 pt-2" />
        </SettingsRow>
      </SettingsBox> */}

      {/* <SettingsBox>
        <SettingsTitle>Base Pan</SettingsTitle>
        <SettingsRow>
          <Slider className="w-64 pt-2" />
        </SettingsRow>
      </SettingsBox> */}

      {/* <SettingsBox>
        <SettingsTitle>Accent 1</SettingsTitle>
        <SettingsRow>
          <Slider className="w-64 pt-2" />
        </SettingsRow>
      </SettingsBox> */}

      {/* <SettingsBox>
        <SettingsTitle>Accent 1 Pitch</SettingsTitle>
        <SettingsRow>
          <Slider className="w-64 pt-2" />
        </SettingsRow>
      </SettingsBox> */}

      {/* <SettingsBox>
        <SettingsTitle>Accent 1 Pan</SettingsTitle>
        <SettingsRow>
          <Slider className="w-64 pt-2" />
        </SettingsRow>
      </SettingsBox> */}

      {/* <SettingsBox>
        <SettingsTitle>Accent 2</SettingsTitle>
        <SettingsRow>
          <Slider className="w-64 pt-2" />
        </SettingsRow>
      </SettingsBox> */}

      {/* <SettingsBox>
        <SettingsTitle>Accent 2 Pitch</SettingsTitle>
        <SettingsRow>
          <Slider className="w-64 pt-2" />
        </SettingsRow>
      </SettingsBox> */}

      {/* <SettingsBox>
        <SettingsTitle>Accent 2 Pan</SettingsTitle>
        <SettingsRow>
          <Slider className="w-64 pt-2" />
        </SettingsRow>
      </SettingsBox> */}
    </section>
  );
};
