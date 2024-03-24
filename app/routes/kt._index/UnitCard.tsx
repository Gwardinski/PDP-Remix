import { Unit } from "./_data";
import { useGameStore } from "./_state";

export const UnitCard = ({ unit }: { unit: Unit }) => {
  const action = useGameStore((state) => state.selectedAction);
  const selectedUnits = useGameStore((state) => state.selectedUnits);
  const setUnits = useGameStore((state) => state.setUnits);
  const selectedTargets = useGameStore((state) => state.selectedTargets);
  const setTargets = useGameStore((state) => state.setTargets);

  const isSelected = selectedUnits?.some((u) => u.id === unit.id);
  const isTarget = selectedTargets?.some((t) => t.id === unit.id);

  function onUnitClick() {
    if (action === "idle") {
      if (selectedUnits.some((u) => u.pid !== unit.pid)) {
        // selecting unit from another player. Remove previous players selection
        setUnits([unit]);
        return;
      }
      if (selectedUnits?.some((u) => u.id === unit.id)) {
        // selecting already selected unit. Remove from selection
        setUnits(selectedUnits.filter((u) => u.id !== unit.id));
        return;
      }
      // add unit to selection
      setUnits([...selectedUnits, unit]);
      return;
    }
    if (action === "attack" || action === "heal" || action === "capture") {
      if (selectedTargets?.some((u) => u.id === unit.id)) {
        // targetting already selected unit. Remove from selection
        setTargets(selectedTargets.filter((t) => t.id !== unit.id));
        return;
      }
      // add unit to selection
      setTargets([...selectedTargets, unit]);
    }
  }

  return (
    <button
      key={unit.id}
      onClick={onUnitClick}
      className={`flex w-full flex-col items-start rounded-md border-2 p-2 
        ${!isSelected && !isTarget && " hover:bg-gray-100"}  
        ${isSelected && "bg-gray-200 hover:bg-gray-200"} 
        ${isSelected && action === "attack" && "border-red-500"} 
        ${isSelected && action === "heal" && "border-green-500"} 
        ${isSelected && action === "capture" && "border-blue-500"}
        ${isTarget && action === "attack" && "bg-red-300 hover:bg-red-400"} 
        ${isTarget && action === "heal" && "bg-green-300 hover:bg-green-400"} 
        ${isTarget && action === "capture" && "bg-blue-300 hover:bg-blue-400"}`}
    >
      <h4 className="text-xl">{unit.name}</h4>
      <div className="flex flex-col items-start">
        <p className="text-sm">Health: {unit.health}</p>
        <p className="text-sm">Weapon: {unit.weapon.name}</p>
        <p className="text-sm">Damage: {unit.weapon.damage}</p>
      </div>
    </button>
  );
};
