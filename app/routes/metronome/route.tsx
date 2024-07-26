import { Page, PageHeader, PageHeading } from "~/components/layout";
import { H1, Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui";
import { BPMController } from "./_BPMController";
import { Metronome } from "./_Metronome";
import { PlayStop } from "./_PlayStop";
import { SettingsAutomation } from "./_SettingsAutomation";
import { SettingsSounds } from "./_SettingsSounds";
import { SettingsTime } from "./_SettingsTime";
import { useMetronomeState } from "./_state";

const MetronomePage = () => {
  const tab = useMetronomeState((state) => state.tab);
  const setTab = useMetronomeState((state) => state.setTab);
  const beats = useMetronomeState((state) => state.beats);
  const notes = useMetronomeState((state) => state.notes);

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <H1>Metronome (WIP)</H1>
        </PageHeading>
      </PageHeader>

      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="glass dark:dark-glass flex w-full max-w-lg flex-col items-center justify-center gap-4 p-4">
          <BPMController />
          <Metronome />
          <PlayStop />

          <Tabs defaultValue={tab} onValueChange={setTab} className="w-full">
            <TabsList className="lg:w-full">
              <TabsTrigger className="flex-1" value="1">
                {beats} / {notes}
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="2">
                Automation
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="3">
                Sounds
              </TabsTrigger>
            </TabsList>
            <TabsContent value="1">
              <SettingsTime />
            </TabsContent>
            <TabsContent value="2">
              <SettingsAutomation />
            </TabsContent>
            <TabsContent value="3">
              <SettingsSounds />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Page>
  );
};

export default MetronomePage;
