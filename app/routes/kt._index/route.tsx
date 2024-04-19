import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui";
import { BattleAccolades } from "./BattleAccolades";
import { BattleCommands } from "./BattleCommands";
import { BattleOverview } from "./BattleOverview";
import { ReporterConfirmAttack } from "./ReporterConfirmAttack";
import { ReporterConfirmHeal } from "./ReporterConfirmHeal";
import { ReporterSelect } from "./ReporterSelect";
import { useGameStore } from "./_state";

const KTPage = () => {
  const mode = useGameStore((state) => state.selectedMode);
  const action = useGameStore((state) => state.selectedAction);
  const selectedUnits = useGameStore((state) => state.selectedUnits);
  const reset = useGameStore((state) => state.reset);

  if (action !== "idle" && !Boolean(selectedUnits.length)) {
    // edge-case handler
    reset();
  }

  function submit() {
    // update values
    // do api
    reset();
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-x-hidden ">
      <Tabs defaultValue="reporter">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reporter">Reporter</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex flex-col gap-4">
          <BattleOverview />
          <BattleAccolades />
        </TabsContent>
        <TabsContent value="reporter">
          <section className="flex flex-col gap-2">
            <h2 className="text-lg">Battle Reporter</h2>
            {mode === "selecting" && (
              <>
                <ReporterSelect />
                <BattleCommands />
              </>
            )}
            {mode === "confirming" && action === "attack" && (
              <ReporterConfirmAttack />
            )}
            {mode === "confirming" && action === "heal" && (
              <ReporterConfirmHeal />
            )}
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KTPage;
