import { UnitCard } from "./UnitCard";
import { useGameStore } from "./_state";

export const ReporterSelect: React.FC = () => {

    const players = useGameStore((state) => state.players);


    return (
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
  </div>)
}