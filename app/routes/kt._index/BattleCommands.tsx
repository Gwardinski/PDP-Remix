import { Button } from "~/components/ui";
import { useGameStore } from "./_state";
import { InfoCard } from "./components";

export const BattleCommands = () => {
  const mode = useGameStore((state) => state.selectedMode);
  const action = useGameStore((state) => state.selectedAction);
  const selectedUnits = useGameStore((state) => state.selectedUnits);
  const selectedTargets = useGameStore((state) => state.selectedTargets);
  const setMode = useGameStore((state) => state.setMode);
  const setAction = useGameStore((state) => state.setAction);
  const reset = useGameStore((state) => state.reset);

  const pulseUnits = !selectedUnits.length && action === "idle";
  const pulseActions = selectedUnits.length && action === "idle";
  const pulseTargets =
    selectedUnits.length &&
    (action === "attack" || action === "heal") &&
    !selectedTargets.length;
  const pulseConfirm =
    selectedUnits.length &&
    (action === "capture" ||
      ((action === "attack" || action === "heal") && selectedTargets.length));

  function confirmAction() {
    setMode("confirming");
    if (action === "idle") {
      return;
    }
    if (action === "attack") {
      selectedUnits.forEach((unit) => {
        selectedTargets.forEach((target) => {
          // attack logic
          console.log(`${unit.name} attacks ${target.name}`);
        });
      });
    }
    if (action === "heal") {
      selectedUnits.forEach((unit) => {
        selectedTargets.forEach((target) => {
          // heal logic
          console.log(`${unit.name} heals ${target.name}`);
        });
      });
    }
    if (action === "capture") {
      selectedUnits.forEach((unit) => {
        selectedTargets.forEach((target) => {
          // capture logic
          console.log(`${unit.name} captures ${target.name}`);
        });
      });
    }
  }

  if (mode !== "selecting") {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 flex flex-col gap-4 rounded-md bg-zinc-200 p-4 transition-all duration-200 ease-in-out">
      <div className="flex justify-between gap-2">
        <InfoCard
          title="Unit(s)"
          className={`${pulseUnits && "animate-pulse"} `}
        >
          {pulseUnits
            ? "Select Unit(s)"
            : selectedUnits.map((u) => u.name).join(", ")}
        </InfoCard>
        <InfoCard
          title="Target(s)"
          className={`${pulseTargets && "animate-pulse"} `}
        >
          {pulseTargets
            ? "Select Target(s)"
            : selectedTargets.map((u) => u.name).join(", ")}
        </InfoCard>
      </div>
      <div className="flex w-full gap-2">
        <InfoCard
          title="Actions"
          className={`${pulseActions && "animate-pulse"} `}
        >
          <div className="flex w-full flex-row items-center justify-evenly gap-2">
            <Button
              className={`w-full ${pulseActions && "animate-pulse bg-red-500"}`}
              onClick={() => setAction("attack")}
              disabled={!selectedUnits.length}
              variant={action === "attack" ? "default" : "outline"}
            >
              Attack
            </Button>
            <Button
              className={`w-full ${pulseActions && "animate-pulse bg-green-500"}`}
              onClick={() => setAction("heal")}
              disabled={!selectedUnits.length}
              variant={action === "heal" ? "default" : "outline"}
            >
              Heal
            </Button>
            <Button
              className={`w-full ${pulseActions && "animate-pulse bg-blue-500"}`}
              onClick={() => setAction("capture")}
              disabled={!selectedUnits.length}
              variant={action === "capture" ? "default" : "outline"}
            >
              Capture
            </Button>
          </div>
        </InfoCard>
      </div>
      <div className="flex gap-2">
        <Button
          className="w-full"
          onClick={reset}
          disabled={!selectedUnits.length}
          variant={"default"}
        >
          Clear
        </Button>
        <Button
          className={`w-full ${pulseConfirm && "animate-pulse"}`}
          onClick={confirmAction}
          disabled={
            action === "idle" ||
            !selectedUnits.length ||
            (!selectedTargets.length && action !== "capture")
          }
          variant={"default"}
        >
          Confirm
        </Button>
      </div>
    </footer>
  );
};
