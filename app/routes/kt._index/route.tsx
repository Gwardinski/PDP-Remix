import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui";
import { BattleAccolades } from "./BattleAccolades";
import { BattleCommands } from "./BattleCommands";
import { BattleOverview } from "./BattleOverview";
import { ReporterConfirmAttack } from "./ReporterConfirmAttack";
import { UnitCard } from "./UnitCard";
import { PLAYERS } from "./_data";
import { useGameStore } from "./_state";

const KTPage = () => {
  const players = PLAYERS;

  const mode = useGameStore((state) => state.selectedMode);
  const setMode = useGameStore((state) => state.setMode);
  const action = useGameStore((state) => state.selectedAction);
  const setAction = useGameStore((state) => state.setAction);
  const selectedUnits = useGameStore((state) => state.selectedUnits);
  const setUnits = useGameStore((state) => state.setUnits);
  const selectedTargets = useGameStore((state) => state.selectedTargets);
  const setTargets = useGameStore((state) => state.setTargets);
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
              <div className="flex flex-row gap-4 overflow-x-auto">
                {players.map((player) => (
                  <section key={player.id} className="flex flex-col">
                    <header>
                      <h4 className="text-xl">{player.name}</h4>
                      <p className="p-0 text-sm">Points: {player.points}</p>
                    </header>
                    <div className="flex flex-col items-start gap-2 ">
                      {player.units.map((unit) => (
                        <UnitCard key={unit.id} unit={unit} />
                      ))}
                    </div>
                  </section>
                ))}
                <BattleCommands />
              </div>
            )}

            {mode === "confirming" && <ReporterConfirmAttack />}
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KTPage;
