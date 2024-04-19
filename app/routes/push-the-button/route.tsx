import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Push the Button" },
    {
      name: "Push the Button",
      content:
        "You have to push the button. Do you have what it takes to push the button? Challenge. Puzzle. RPG. Level Up. EXP.",
    },
  ];
};

const PushTheButton = () => {
  const level = 1;

  return (
    <main className="flex h-full w-full flex-col">
      {level === 1 && (
        <>
          <div className="flex h-full w-full flex-col items-center justify-center">
            <button>Click the Button</button>
          </div>
        </>
      )}
    </main>
  );
};

export default PushTheButton;

const WaitTimes = {
  1: 4,
  2: 16,
  3: 32,
  4: 1200,
  5: 60,
  6: 3600,
  7: 14400,
  8: 14400,
  9: 14400,
  10: 30,
  11: 14400,
  12: 14400,
  13: 14400,
};

// Mouse is torch in the dark
// Button hides from the light
// advent calendar style surprise on win
// Button has health (no of clicks)
// level-up clicking power?
// currency?
// button hides as other element
// html rpg?
