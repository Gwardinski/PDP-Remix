import { ActionFunctionArgs, json } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { differenceInMilliseconds } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { create } from "zustand";
import { db } from "~/api/db";
import { Scoreboard } from "~/api/schema";
import {
  Page,
  PageHeader,
  PageHeading,
  PageSection,
} from "~/components/layout";
import {
  Button,
  H1,
  H2,
  H4,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui";
import { cn } from "~/components/utils";

async function createScoreEntry(nickname: string, hash: string) {
  db.insert(Scoreboard).values({ nickname, hash });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const type = formData.get("type");
  const nickname = formData.get("nickname");

  // Check if nickname is a string
  if (typeof nickname !== "string") {
    return json({ error: "Invalid data submitted" }, { status: 400 });
  }

  if (!nickname || !type) {
    return null;
  }

  if (type === "INIT") {
    const timestamp = Date.now();
    const hash = await bcrypt.hash(`${nickname}-HASH-${timestamp}`, 10);
    const userRes = await createScoreEntry(nickname, hash);
    return hash;
  }
  if (type === "SUBMIT") {
    const code = formData.get("code");
  }
};

const MazePage = () => {
  const tab1 = useTabStore((state) => state.tab1);
  const setTab1 = useTabStore((state) => state.setTab1);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [completionTime, setCompletionTime] = useState(0);
  const [hasTorch, setHasTorch] = useState(false);
  const [hasButton1, setHasButton1] = useState(false);
  const [hasButton2, setHasButton2] = useState(false);
  const [hasButton3, setHasButton3] = useState(false);

  useFollowMouse(hasTorch);
  const { seconds, isRunning, startTimer, stopTimer } = useGameTimer();

  function onStartGame() {
    if (hasTorch || isRunning) {
      return;
    }
    startTimer();
    setHasTorch(true);
    setStartDate(new Date());
  }

  function onToggleButton1() {
    if (hasButton1 || !isRunning) {
      return;
    }
    setHasButton1((v) => !v);
  }

  function onToggleButton2() {
    if (hasButton2 || !isRunning) {
      return;
    }
    setHasButton2((v) => !v);
  }

  function onToggleButton3() {
    if (hasButton3 || !isRunning) {
      return;
    }
    setHasButton3((v) => !v);
  }

  function resetGame() {
    stopTimer();
    setHasTorch(false);
    setHasButton1(false);
    setHasButton2(false);
    setHasButton3(false);
  }

  function completeGame() {
    if (
      !hasButton1 ||
      !hasButton2 ||
      !hasButton3 ||
      !isRunning ||
      !hasTorch ||
      seconds < 5
    ) {
      return;
    }
    setGameCompleted(true);
    setCompletionTime(differenceInMilliseconds(new Date(), startDate) / 1000);
    resetGame();
  }

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <H1>Maze (WIP)</H1>
        </PageHeading>
      </PageHeader>

      <PageSection>
        <Tabs defaultValue={tab1} onValueChange={setTab1}>
          <TabsList className="glass dark:dark-glass mb-4">
            <TabsTrigger value="1">Game</TabsTrigger>
            <TabsTrigger value="2">Scoreboard</TabsTrigger>
          </TabsList>
          <TabsContent value="1">
            <section className="glass dark:dark-glass relative flex flex-col items-center justify-center gap-8 px-8 pb-32 pt-8">
              <div className="z-10 flex w-full max-w-5xl items-center justify-center gap-4">
                <H2 className="mr-auto">Time: {seconds}</H2>
                <Stat hasCollected={hasButton1}>
                  Switch 1: {hasButton1 ? "On" : "Off"}
                </Stat>
                <Stat hasCollected={hasButton2}>
                  Switch 2: {hasButton2 ? "On" : "Off"}
                </Stat>
                <Stat hasCollected={hasButton3}>
                  Switch 3: {hasButton3 ? "On" : "Off"}
                </Stat>
                <Stat hasCollected={hasButton1 && hasButton2 && hasButton3}>
                  Exit:{" "}
                  {hasButton1 && hasButton2 && hasButton3 ? "Open" : "Closed"}
                </Stat>
              </div>
              {gameCompleted && (
                <div className="absolute top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-1">
                  <div className="flex animate-bounce flex-col text-center">
                    <H1>Game Complete</H1>
                    <H2>Time: {completionTime}</H2>
                  </div>
                </div>
              )}

              <div
                className={`${isRunning ? "hover:cursor-move" : "hover:cursor-crosshair"} relative flex w-fit flex-col items-center justify-center`}
                onMouseLeave={resetGame}
              >
                {bricks.map((row, i) => (
                  <div
                    key={i}
                    className="flex w-full items-center justify-center gap-0"
                  >
                    {row.map((cell, j) => (
                      <div key={j} className="h-16 w-16">
                        {cell === 0 && <Wall onMouseEnter={resetGame} />}
                        {cell === 1 && <Path />}
                        {cell === 2 && <Start onMouseEnter={onStartGame} />}
                        {cell === 3 && <Goal onMouseEnter={completeGame} />}
                        {cell === 4 && (
                          <Switch
                            onMouseEnter={onToggleButton1}
                            hasCollected={hasButton1}
                          />
                        )}
                        {cell === 5 && (
                          <Switch
                            onMouseEnter={onToggleButton2}
                            hasCollected={hasButton2}
                          />
                        )}
                        {cell === 6 && (
                          <Switch
                            onMouseEnter={onToggleButton3}
                            hasCollected={hasButton3}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                {!gameCompleted && (
                  <div
                    id="blackout"
                    style={{
                      position: "absolute",
                      top: "0px",
                      left: "0px",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                      background:
                        "radial-gradient(circle at var(--x) var(--y) , transparent 20px, rgba(0,0,0,1) 60px)",
                    }}
                  />
                )}
              </div>
            </section>
          </TabsContent>
          <TabsContent value="2">TODO</TabsContent>
        </Tabs>
      </PageSection>
    </Page>
  );
};

function Wall({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-16 w-16 bg-gray-500", className)} {...props} />;
}
function Path({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("h-16 w-16 bg-yellow-500", className)} {...props} />
  );
}
function Start({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      id="start"
      className={cn("h-16 w-16 bg-orange-500", className)}
      {...props}
    />
  );
}
function Goal({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-16 w-16 bg-red-500", className)} {...props} />;
}

interface SwitchProps extends React.HTMLAttributes<HTMLButtonElement> {
  hasCollected: boolean;
}
function Switch({ className, hasCollected, ...props }: SwitchProps) {
  return (
    <Button
      variant="unstyled"
      className={cn(
        `h-16 w-16 rounded-none ${
          hasCollected ? "bg-yellow-500" : "animate-pulse bg-green-500"
        }`,
        className,
      )}
      {...props}
    />
  );
}

interface StatProps extends React.HTMLAttributes<HTMLHeadingElement> {
  hasCollected: boolean;
}
function Stat({ className, hasCollected, ...props }: StatProps) {
  return (
    <H4
      className={cn(
        `w-32 text-right ${
          hasCollected
            ? "text-green-500 dark:text-green-500"
            : "text-red-500 dark:text-red-500"
        }`,
        className,
      )}
      {...props}
    />
  );
}

export default MazePage;

const useGameTimer = () => {
  const intervalRef = useRef<NodeJS.Timeout>();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      setSeconds(0);
      clearInterval(intervalRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning, seconds]);

  function startTimer() {
    setSeconds(0);
    setIsRunning(true);
  }

  function stopTimer() {
    setSeconds(0);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }

  return { seconds, isRunning, startTimer, stopTimer };
};

const useFollowMouse = (hasTorch: boolean) => {
  useEffect(() => {
    const pos = document.documentElement;
    if (!hasTorch) {
      var start = document.getElementById("start");
      pos.style.setProperty("--x", (start?.offsetLeft ?? 0) + 32 + "px");
      pos.style.setProperty("--y", (start?.offsetTop ?? 0) + 32 + "px");
      return;
    }

    const follow = (e: MouseEvent) => {
      pos.style.setProperty("--x", e.layerX + "px");
      pos.style.setProperty("--y", e.layerY + "px");
    };

    pos.addEventListener("mousemove", follow);

    return () => {
      pos.removeEventListener("mousemove", follow);
    };
  }, [hasTorch]);

  return {};
};

const bricks = [
  [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 4, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 6, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 5, 1, 1, 0, 0, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
];

// 0 = wall
// 1 = path
// 2 = start
// 3 = end
// 4 5 6 = buttons

interface TabStore {
  tab1: string;
  setTab1: (v: string) => void;
}

const useTabStore = create<TabStore>((set) => ({
  tab1: "1",
  setTab1: (v) => set(() => ({ tab1: v })),
}));
