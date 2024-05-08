import { Minus, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui";
import { useGameStore } from "./_state";
import { InfoCard } from "./components";

export const ReporterConfirmAttack: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  const action = useGameStore((state) => state.selectedAction);
  const selectedUnits = useGameStore((state) => state.selectedUnits);
  const selectedTargets = useGameStore((state) => state.selectedTargets);
  const reset = useGameStore((state) => state.reset);

  const [totalDamage, setTotalDamage] = useState(
    selectedUnits.map((u) => u.weapon.damage).reduce((a, b) => a + b, 0),
  );
  const [missed, setMissed] = useState(0);

  const [parried, setParried] = useState(0);

  const [inflicted, setInflicted] = useState(
    selectedUnits.map((u) => u.weapon.damage).reduce((a, b) => a + b, 0),
  );

  if (action !== "attack") {
    return null;
  }

  function submit() {
    // update values
    // do api
    reset();
    toast("Attack successfully reported! Battle Reports have been updated.");
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h2 className="text-2xl">Units</h2>
      <InfoCard title="Total Damage Dealt">
        {showInfo && (
          <div className="flex flex-col gap-0 py-2 text-sm">
            <p>Full damage inflicted, including environmental</p>
            {selectedUnits.length > 1 && (
              <>
                <p>
                  Comrades share in the glory of their victory. The total damage
                  dealt will be applied to both units battle reports, not split
                  among them.
                </p>
                <p>
                  Note: It will only be applied once to the team as a whole.
                </p>
              </>
            )}
          </div>
        )}
        <div className="flex w-full flex-row items-center justify-start gap-2">
          <div className="flex w-1/2 flex-col items-start justify-start gap-2 overflow-x-clip">
            {selectedUnits.map((u) => (
              <h4 key={u.id} className="text-xl">
                {u.name}
              </h4>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button size="icon" onClick={() => setTotalDamage((v) => v - 1)}>
              <Minus />
            </Button>
            <h6 className="w-6">{totalDamage}</h6>
            <Button size="icon" onClick={() => setTotalDamage((v) => v + 1)}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </InfoCard>

      <InfoCard title="Shots Missed">
        {showInfo && (
          <div className="flex flex-col gap-0 py-2 text-sm">
            <p>Misses only. Do not include cover, enemy shields etc</p>
            {selectedUnits.length > 1 && (
              <p>
                Comrades share in their failure. Penalties are applied to all
                parties that bring shame.
              </p>
            )}
          </div>
        )}
        <div className="flex w-full flex-row items-center justify-start gap-2">
          <div className="flex w-1/2 flex-col items-start justify-start gap-2 overflow-x-clip">
            {selectedUnits.map((u) => (
              <h4 key={u.id} className="text-xl">
                {u.name}
              </h4>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button size="icon" onClick={() => setMissed((v) => v - 1)}>
              <Minus />
            </Button>
            <h6 className="w-6">{missed}</h6>
            <Button size="icon" onClick={() => setMissed((v) => v + 1)}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </InfoCard>

      <h2 className="text-2xl">Targets</h2>
      <InfoCard title="Damage Deflected">
        {showInfo && (
          <div className="flex flex-col gap-0 py-2 text-sm">
            <p>
              Any cover, shields, luck or anything else that prevented a clean
              shot.
            </p>
          </div>
        )}
        <div className="flex w-full flex-row items-center justify-start gap-2">
          <div className="flex w-1/2 flex-col items-start justify-start gap-2 overflow-x-clip">
            {selectedTargets.map((u) => (
              <h4 key={u.id} className="text-xl">
                {u.name}
              </h4>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button size="icon" onClick={() => setParried((v) => v - 1)}>
              <Minus />
            </Button>
            <h6 className="w-6">{parried}</h6>
            <Button size="icon" onClick={() => setParried((v) => v + 1)}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </InfoCard>

      <InfoCard title="Damage Inflicted">
        {showInfo && (
          <div className="flex flex-col gap-0 py-2 text-sm">
            <p>Full damage taken, including environmental</p>
          </div>
        )}
        <div className="flex w-full flex-row items-center justify-start gap-2">
          <div className="flex w-1/2 flex-col items-start justify-start gap-2 overflow-x-clip">
            {selectedTargets.map((u) => (
              <h4 key={u.id} className="text-xl">
                {u.name}
              </h4>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button size="icon" onClick={() => setInflicted((v) => v - 1)}>
              <Minus />
            </Button>
            <h6 className="w-6">{inflicted}</h6>
            <Button size="icon" onClick={() => setInflicted((v) => v + 1)}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </InfoCard>

      <div className="fixed bottom-0 left-0 right-0 flex w-full flex-col gap-2 bg-zinc-200 p-4">
        <Button onClick={() => setShowInfo((v) => !v)}>Show Info</Button>
        <div className="flex gap-2">
          <Button onClick={reset} className="w-full">
            Cancel
          </Button>
          <Button onClick={submit} className="w-full">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};
