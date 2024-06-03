import { useState } from "react";
import { Button } from "~/components/ui";

type Role = "Sheriff" | "Deputy" | "Outlaw" | "Renegade";

enum CharacterModifier {
  SNIPER = 1,
  BARREL = 2,
  VULTURE = 3,
  GAMBLER = 4,
  PACIFIST = 5,
  PYRO = 6,
}

type Character = {
  id: string;
  suffix: string;
  description: string;
  image: string;
  modifier: CharacterModifier;
  maxHealth: number;
};

type Player = {
  id: string;
  name: string;
  role: Role;
  character: Character;
  health: number;
  arrows: number;
};

type PewGame = {
  id: string;
  name: string;
  players: Player[];
};

const DICE_FACES = [
  "1Shoot",
  "2Shoot",
  "Beer",
  "Gatling",
  "Arrow",
  "Dynamite",
] as const;
type Dice = (typeof DICE_FACES)[number];

function singleDiceRoll(): Dice {
  return DICE_FACES[Math.floor(Math.random() * DICE_FACES.length)];
}

function multipleDiceRoll(remainingDice: number): Dice[] {
  const dice: Dice[] = [];
  for (let i = 0; i < remainingDice; i++) {
    dice.push(singleDiceRoll());
  }
  return dice;
}

const getMaxNumberOfRolls = (mod: CharacterModifier) => {
  if (mod === CharacterModifier.GAMBLER) {
    return 5;
  }
  return 3;
};

const NO_OF_ARROWS = 9;
const NO_OF_DICE = 5;

const PewPage = () => {
  const [players, setPlayers] = useState<Player[]>([PLAYER]);
  const [currentPlayer, setCurrentPlayer] = useState<string>(players[0].id);

  const [boxDice, setBoxDice] = useState<Dice[]>([]);
  const [selectedDice, setSelectedDice] = useState<Dice[]>([]);
  const [remainingRolls, setRemainingRolls] = useState(NO_OF_DICE);

  const [arrows, setArrows] = useState<number>(NO_OF_ARROWS);

  const arrowsToHandle = boxDice.includes("Arrow");
  const dynamiteToHandle = boxDice.includes("Dynamite");
  const disableRoll =
    remainingRolls <= 0 ||
    selectedDice.length === 5 ||
    arrowsToHandle ||
    dynamiteToHandle;

  function rollDiceIntoBox() {
    if (disableRoll) {
      return;
    }

    const dice = multipleDiceRoll(NO_OF_DICE - selectedDice.length);
    setBoxDice(dice);
    setRemainingRolls((v) => v - 1);
  }

  function selectDiceFromBox(dice: Dice, i: number) {
    if (
      selectedDice.length >= NO_OF_DICE ||
      arrowsToHandle ||
      dynamiteToHandle
    ) {
      return;
    }

    setBoxDice(boxDice.filter((_, j) => j !== i));
    setSelectedDice([...selectedDice, dice]);
  }

  function takeArrows() {
    const arrowsToTake = boxDice.filter((d) => d === "Arrow").length;
    const plys = [...players];
    plys.forEach((p) => {
      if (p.id === currentPlayer) {
        p.arrows += arrowsToTake;
      }
    });
    setPlayers(plys);
  }

  function handleArrow() {
    if (!arrowsToHandle) return;

    const plys = [...players];
    const arrows = boxDice.filter((d) => d === "Arrow").length;

    plys.forEach((p) => {
      p.health -= p.arrows;
      if (p.id === currentPlayer) {
        p.health -= arrows;
      }
    });
    setPlayers(plys);
  }

  function handleDynamite() {
    if (!dynamiteToHandle) return;

    const plys = [...players];
    plys.forEach((p) => {
      if (p.id === currentPlayer) {
        p.health -= 1;
      }
    });
    endRound();
  }

  function endRound() {
    setSelectedDice([]);
    setBoxDice([]);
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="relative grid h-full w-full grid-cols-5 gap-8">
        <div className="absolute left-0 top-0 h-20 w-40 rounded-lg bg-blue-300 p-2">
          Instructions in here
        </div>
        <div className="absolute right-0 top-0 h-20 w-40 rounded-lg bg-red-400 p-2">
          <div className="flex gap-2">
            {Array.from({ length: arrows }, (_, index) => (
              <div key={index}>A</div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="aspect-[3/4] h-60 rounded-sm bg-pink-700" />
        </div>

        <div className="flex flex-col items-center justify-center gap-8 py-12">
          <div className="aspect-[3/4] h-60 rounded-sm bg-pink-700" />
          <div className="aspect-[3/4] h-60 rounded-sm bg-pink-700" />
        </div>

        <div className="flex flex-col items-center justify-between gap-8">
          <div className="aspect-[3/4] h-60 rounded-sm bg-pink-700" />
          <div className="flex w-full flex-col gap-4">
            <div className="flex h-20 w-full items-center justify-center rounded-md bg-green-700 p-4">
              <div className="flex gap-2">
                {selectedDice.map((d, i) => (
                  <div key={i}>{d}</div>
                ))}
              </div>
            </div>
            <div className="flex h-40 w-full flex-col items-center justify-center rounded-md bg-green-700 p-4">
              <div className="flex gap-2">
                {boxDice.map((d, i) => (
                  <Button
                    size="icon"
                    className="rounded-sm"
                    key={i}
                    onClick={() => selectDiceFromBox(d, i)}
                  >
                    {d.substring(0, 1)}
                  </Button>
                ))}
              </div>
              <Button onClick={rollDiceIntoBox} disabled={disableRoll}>
                Roll ({remainingRolls})
              </Button>
              <Button onClick={handleArrow} disabled={!arrowsToHandle}>
                Handle Arrows
              </Button>
              <Button onClick={handleDynamite} disabled={!dynamiteToHandle}>
                Handle Dynamite
              </Button>
            </div>
          </div>
          <div className="relative flex aspect-[3/4] h-60 items-start justify-center rounded-sm bg-pink-700">
            <div className="flex aspect-[3/4] h-72 flex-col gap-2 rounded-sm bg-pink-700 p-2">
              <p>{players[0].name}</p>
              <p>{players[0].character.suffix}</p>
              <p>{players[0].character.description}</p>
              <p>{players[0].character.image}</p>
              <p>{players[0].role}</p>
              <p>
                Health: {players[0].health} / {players[0].character.maxHealth}
              </p>
              <p>Arrows: {players[0].arrows}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-8 py-12">
          <div className="aspect-[3/4] h-60 rounded-sm bg-pink-700" />
          <div className="aspect-[3/4] h-60 rounded-sm bg-pink-700" />
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="aspect-[3/4] h-60 bg-pink-700" />
        </div>
      </div>
    </div>
  );
};

export default PewPage;

const CHARACTER_DECK: Character[] = [
  {
    id: "c1",
    suffix: "The Vulture",
    description: "On death of any character, gain 2 life points",
    image: "image.png",
    modifier: CharacterModifier.VULTURE,
    maxHealth: 9,
  },
  {
    id: "c2",
    suffix: "The Sniper",
    description: "Can shoot 1 extra place",
    image: "image.png",
    modifier: CharacterModifier.SNIPER,
    maxHealth: 7,
  },
  {
    id: "c3",
    suffix: "The 6 Shotter",
    description: "Roll five shooting dice, and you can shoot a sixth shot",
    image: "image.png",
    modifier: CharacterModifier.BARREL,
    maxHealth: 8,
  },
  {
    id: "c4",
    suffix: "The Gambler",
    description: "You can roll the dice up to 5 times",
    image: "image.png",
    modifier: CharacterModifier.GAMBLER,
    maxHealth: 8,
  },
  {
    id: "c5",
    suffix: "The Pacifist",
    description:
      "Skip your go, and the next player must skip theirs too. Can not be used 2 turns in a row",
    image: "image.png",
    modifier: CharacterModifier.PACIFIST,
    maxHealth: 7,
  },
  {
    id: "c6",
    suffix: "The Pyro",
    description: "You can re-roll dynamite",
    image: "image.png",
    modifier: CharacterModifier.PYRO,
    maxHealth: 7,
  },
];

const ROLE_DECK: Role[] = ["Sheriff", "Deputy", "Outlaw", "Renegade"];

const PLAYER: Player = {
  id: "p1",
  name: "Gordon",
  role: ROLE_DECK[0],
  character: CHARACTER_DECK[0],
  health: CHARACTER_DECK[0].maxHealth,
  arrows: 0,
};
